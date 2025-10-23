import { fetchContentFromContentHash } from "@/utils/ipfs"
import type {
  DecodedDataItem,
  GraphQLResponse,
} from "@/types/eas"
import type { ProductInfo, RawProductData, MediaManifest } from "@/types/product"
import { createPublicClient, http, Address } from "viem"
import { baseSepolia } from "viem/chains"
import { INVENTORY_ABI } from "@/app/contracts/abis/losa/Inventory"
import { PRICE_WITH_PLUGINS_ABI } from "@/app/contracts/abis/losa/PriceWithPlugins"

/**
 * Fetch inventory quantity for a variation (skuUid) from the Inventory contract
 */
async function fetchInventoryQuantity(variationId: string, inventoryContract?: Address): Promise<number> {
  try {
    // Return 0 if no inventory contract is configured
    if (!inventoryContract) {
      console.warn("No inventory contract configured for store")
      return 0
    }

    // Create a public client for reading from the contract (same config as order route)
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(
        `${process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_ENDPOINT}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      ),
    })

    // Convert variation ID to bytes32 format expected by contract
    const skuUid = variationId as `0x${string}`

    // Call getAvailableQuantity with the variation ID and zero address (general inventory)
    const quantity = await publicClient.readContract({
      address: inventoryContract,
      abi: INVENTORY_ABI,
      functionName: "getAvailableQuantity",
      args: [skuUid, "0x0000000000000000000000000000000000000000"],
    })

    return Number(quantity)
  } catch (error) {
    console.error("Failed to fetch inventory quantity:", error)
    return 0
  }
}

/**
 * Fetch price for a variation (skuUid) from the PriceWithPlugins contract
 */
async function fetchSkuPrice(variationId: string, priceContract?: Address): Promise<number> {
  try {
    // Return 0 if no price contract is configured
    if (!priceContract) {
      console.warn("No price contract configured for store")
      return 0
    }

    // Create a public client for reading from the contract (same config as order route)
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(
        `${process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA_ENDPOINT}${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      ),
    })

    // Convert variation ID to bytes32 format expected by contract
    const skuUid = variationId as `0x${string}`

    // Call getSkuPrice with the variation ID
    const priceResult = await publicClient.readContract({
      address: priceContract,
      abi: PRICE_WITH_PLUGINS_ABI,
      functionName: "getSkuPrice",
      args: [skuUid],
    })

    // priceResult is a Price struct with { amount: bigint, paymentToken: address }
    // Convert amount from smallest unit to a reasonable number
    // USDC has 6 decimals, so divide by 1e6
    const amount = Number(priceResult.amount) / 1e6

    return amount
  } catch (error) {
    console.error("Failed to fetch price:", error)
    return 0
  }
}

export async function fetchProductData(
  productId: string,
  easscanGraphqlEndpoint: string,
  storeId?: string,
  inventoryContract?: Address,
  priceContract?: Address
): Promise<ProductInfo | null> {
  // First, get the variation that references this product
  const variationResponse = await fetch(easscanGraphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetVariationForProduct($where: AttestationWhereInput) {
          attestations(where: $where) {
            id
          }
        }
      `,
      variables: {
        where: {
          AND: [
            {
              revoked: {
                equals: false,
              },
            },
            {
              refUID: {
                equals: productId,
              },
            },
            {
              schemaId: {
                equals: process.env.VARIATION_SCHEMA_UID,
              },
            },
          ],
        },
      },
    }),
  })

  if (!variationResponse.ok) {
    throw new Error(`GraphQL request failed: ${variationResponse.status}`)
  }

  const variationData = await variationResponse.json()

  if (!variationData.data.attestations.length) {
    throw new Error(`No variation found for product ${productId}`)
  }

  const variationId = variationData.data.attestations[0].id

  // Now fetch all attestations that reference the variation
  const response = await fetch(easscanGraphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetProductData($where: AttestationWhereInput) {
          attestations(where: $where) {
            id
            decodedDataJson
            schemaId
          }
        }
      `,
      variables: {
        where: {
          AND: [
            {
              revoked: {
                equals: false,
              },
            },
            {
              refUID: {
                equals: variationId,
              },
            },
            {
              OR: [
                { schemaId: { equals: process.env.NAME_SCHEMA_UID } },
                { schemaId: { equals: process.env.DESCRIPTION_SCHEMA_UID } },
                { schemaId: { equals: process.env.MEDIA_MANIFEST_SCHEMA_UID } },
                { schemaId: { equals: process.env.RETURN_WINDOW_SCHEMA_UID } },
                { schemaId: { equals: process.env.RETURN_POLICY_SCHEMA_UID } },
                { schemaId: { equals: process.env.SHIPPING_COST_TYPE_SCHEMA_UID } },
                { schemaId: { equals: process.env.SKU_SCHEMA_UID } },
                { schemaId: { equals: process.env.UPC_SCHEMA_UID } },
                { schemaId: { equals: process.env.STORE_ID_SCHEMA_UID } },
              ],
            },
          ],
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`)
  }

  const productData: GraphQLResponse = await response.json()

  // Initialize raw product data structure (before IPFS resolution)
  const rawProductData: RawProductData = {
    // Core product data (content hashes)
    name: "",
    descriptionContentHash: "",
    mediaManifestContentHash: null,
    returnWindow: "",
    returnPolicy: "",
    shipping: "",
    sku: "",
    upc: "",
    storeId: "",

    // Variation reference
    variationId,

    // Attestation metadata
    attestations: {
      name: null,
      description: null,
      mediaManifest: null,
      returnWindow: null,
      returnPolicy: null,
      shipping: null,
      sku: null,
      upc: null,
      storeId: null,
    },
  }

  // Process each attestation to extract product data and metadata
  for (const attestation of productData.data.attestations) {
    try {
      const decodedData: DecodedDataItem[] = JSON.parse(attestation.decodedDataJson)

      // Extract data based on the attestation type
      decodedData.forEach((item: DecodedDataItem) => {
        if (item.name === "name" && item.value?.value) {
          rawProductData.name = item.value.value
          rawProductData.attestations.name = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (
          item.name === "descriptionContentHash" &&
          item.value?.value
        ) {
          rawProductData.descriptionContentHash = item.value.value
          rawProductData.attestations.description = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (
          item.name === "mediaManifestContentHash" &&
          item.value?.value
        ) {
          rawProductData.mediaManifestContentHash = item.value.value
          rawProductData.attestations.mediaManifest = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (
          item.name === "returnWindowContentHash" &&
          item.value?.value
        ) {
          rawProductData.returnWindow = item.value.value
          rawProductData.attestations.returnWindow = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (
          item.name === "returnPolicyContentHash" &&
          item.value?.value
        ) {
          rawProductData.returnPolicy = item.value.value
          rawProductData.attestations.returnPolicy = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (
          item.name === "shippingCostTypeContentHash" &&
          item.value?.value
        ) {
          rawProductData.shipping = item.value.value
          rawProductData.attestations.shipping = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (item.name === "sku" && item.value?.value) {
          rawProductData.sku = item.value.value
          rawProductData.attestations.sku = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (item.name === "upc" && item.value?.value) {
          rawProductData.upc = item.value.value
          rawProductData.attestations.upc = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (item.name === "storeId" && item.value?.value) {
          rawProductData.storeId = item.value.value
          rawProductData.attestations.storeId = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        }
      })
    } catch (error) {
      console.error("Failed to parse attestation data:", error)
    }
  }

  // If storeId is provided and doesn't match, return null (filtered out)
  if (storeId && rawProductData.storeId !== storeId) {
    return null
  }

  // Now resolve IPFS content to create the final ProductInfo
  let resolvedDescription = ""
  if (rawProductData.descriptionContentHash) {
    try {
      resolvedDescription = await fetchContentFromContentHash(
        rawProductData.descriptionContentHash
      ) as string
    } catch (error) {
      console.error("Failed to fetch description from IPFS:", error)
      resolvedDescription = ""
    }
  }

  let resolvedMediaManifest: MediaManifest | null = null
  if (rawProductData.mediaManifestContentHash) {
    try {
      const mediaManifestJson = await fetchContentFromContentHash(
        rawProductData.mediaManifestContentHash
      ) as string
      resolvedMediaManifest = JSON.parse(mediaManifestJson) as MediaManifest
    } catch (error) {
      console.error("Failed to fetch media manifest from IPFS:", error)
      resolvedMediaManifest = null
    }
  }

  // Fetch inventory quantity from the Inventory contract
  const inventory = await fetchInventoryQuantity(rawProductData.variationId, inventoryContract)

  // Fetch price from the PriceWithPlugins contract
  const price = await fetchSkuPrice(rawProductData.variationId, priceContract)

  // Create the final ProductInfo with resolved data
  const productInfo: ProductInfo = {
    // Core product data (resolved from IPFS where applicable)
    name: rawProductData.name,
    description: resolvedDescription,
    mediaManifest: resolvedMediaManifest,
    returnWindow: rawProductData.returnWindow,
    returnPolicy: rawProductData.returnPolicy,
    shipping: rawProductData.shipping,
    sku: rawProductData.sku,
    upc: rawProductData.upc,
    storeId: rawProductData.storeId,

    // Contract data
    price: price,
    inventory: inventory,

    // Variation reference
    variationId: rawProductData.variationId,

    // Attestation metadata
    attestations: rawProductData.attestations,

    // UI state
    loading: {
      eas: false,
      contract: false,
    },
  }

  return productInfo
}