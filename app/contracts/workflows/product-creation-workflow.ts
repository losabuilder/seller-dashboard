"use client"

import { useState } from "react"
import { generateSaltFromKey } from "@/utils/create2"
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets"
import { Call } from "viem"
import { useChainId } from "wagmi"
import { getTransactionReceipt } from "wagmi/actions"

import {
  StorachaService,
  type UploadResult,
} from "../../services/storacha-service"
import { tryGetContractConfig } from "../config/contracts"
import { ContractName, SchemaName } from "../config/types"
import { getSchemaUID } from "../config/utils"
import { wagmiConfig } from "../config/wagmi-config"
import { useStore } from "../hooks/useStore"
import { useTransactionExecutor } from "../hooks/useTransactionExecutor"
import { EASService } from "../services/eas-service"
import { InventoryService } from "../services/inventory-service"
import { PriceService } from "../services/price-service"
import { TransactionBuilder } from "../services/transaction-builder"

// Product creation workflow steps
export enum ProductCreationStep {
  IDLE = "idle",
  CREATING_PLUGIN_RESOLVER = "creating_plugin_resolver",
  CREATING_PRODUCT = "creating_product",
  SETTING_PRICE_AND_INVENTORY = "setting_price_and_inventory",
  ADDING_PLUGIN_RESOLVER = "adding_plugin_resolver",
  COMPLETED = "completed",
  ERROR = "error",
}

// Product creation workflow state
export type ProductCreationState = {
  step: ProductCreationStep
  orderPaidPluginResolverAddress: string | null
  productUId: string | null
  variationUId: string | null
  error: Error | null
}

export type MediaManifestItem = {
  role: "hero" | "detail"
  mime: string
  alt: string
  width?: number
  height?: number
}

export type MediaManifest = {
  ordering: string[]
  items: Record<string, MediaManifestItem>
}

export type ProductCreationInput = {
  storeId: string
  name: string
  description: string
  returnWindow: `0x${string}`
  returnPolicy: `0x${string}`
  shipping: `0x${string}`
  price: number
  inventory: number
  images: string[]
  uploadedResults: UploadResult[]
  sku: string
  upc: string
}

/**
 * Hook for orchestrating the product creation workflow
 */
export function useProductCreationWorkflow() {
  const { client } = useSmartWallets()
  const smartWalletAddress = client?.account.address as `0x${string}`
  const chainId = useChainId()
  const easAddress = tryGetContractConfig(ContractName.EAS, chainId)?.address
  const { executeTransaction, error } = useTransactionExecutor()
  const { storeData } = useStore()
  const { priceContract, inventoryContract } = storeData || {}

  const [state, setState] = useState<ProductCreationState>({
    step: ProductCreationStep.IDLE,
    orderPaidPluginResolverAddress: null,
    productUId: null,
    variationUId: null,
    error: null,
  })

  /**
   * Upload product description to IPFS using Storacha
   */
  const uploadProductDescriptionToIPFS = async (
    description: string
  ): Promise<`0x${string}` | null> => {
    if (!description) {
      return null
    }
    try {
      const result = await StorachaService.uploadText(description)
      console.log("Product description uploaded to Storacha:", result.cid)
      return result.contentHash
    } catch (error) {
      console.error("Failed to upload product description to Storacha:", error)
      throw new Error("Failed to upload product description to IPFS")
    }
  }

  /**
   * Create and upload media manifest to IPFS
   */
  const createAndUploadMediaManifestToIPFS = async (
    images: string[],
    uploadedResults: UploadResult[]
  ): Promise<`0x${string}` | null> => {
    try {
      if (images.length === 0) {
        return null
      }

      // Create media manifest structure
      const manifest: MediaManifest = {
        ordering: images, // Use the content hashes as ordering
        items: {},
      }

      // Use actual metadata from uploaded files
      uploadedResults.forEach((result, index) => {
        manifest.items[result.contentHash] = {
          role: index === 0 ? "hero" : "detail",
          mime: result.metadata?.mime || "image/jpeg",
          alt: "", // result.metadata?.alt || `Product image ${index + 1}`,
          width: result.metadata?.width,
          height: result.metadata?.height,
        }
      })

      console.log("Media manifest created:", manifest)

      // Upload manifest to IPFS
      const result = await StorachaService.uploadJson(manifest)
      console.log("Media manifest uploaded to Storacha:", result.cid)
      return result.contentHash
    } catch (error) {
      console.error("Failed to create and upload media manifest:", error)
      throw new Error("Failed to create and upload media manifest to IPFS")
    }
  }

  /**
   * Create product attestation
   */
  const createProductAttestation = async (): Promise<`0x${string}`> => {
    let productSalt: string | undefined
    try {
      // Validate inputs
      if (!smartWalletAddress) {
        throw new Error("Smart wallet address is required")
      }
      if (!chainId) {
        throw new Error("Chain ID is required")
      }

      const txBuilder = new TransactionBuilder()
      productSalt = generateSaltFromKey(smartWalletAddress, "product")

      const productAttestationCall = EASService.createProductAttestationCall(
        chainId,
        { productSalt: productSalt }
      )
      console.log("productAttestationCall:", productAttestationCall)
      txBuilder.addCall(productAttestationCall)

      const txHash = await executeTransaction(txBuilder.getCalls())
      if (!txHash) {
        throw new Error(
          "Transaction execution failed - no transaction hash returned"
        )
      }

      // Get receipt with timeout and retries
      const receipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      })

      if (!receipt?.logs) {
        throw new Error(
          `Transaction succeeded but no logs found. Hash: ${txHash}`
        )
      }

      // Find EAS logs
      const easLogs = receipt.logs.filter((log) => log.address === easAddress)
      if (easLogs.length === 0) {
        throw new Error(`No EAS logs found in transaction. Hash: ${txHash}`)
      }

      // Look for product schema attestation
      const productSchemaUID = getSchemaUID(SchemaName.PRODUCT, chainId)
      const productAttestationLog = easLogs.find(
        (log) => log.topics[3] === productSchemaUID
      )

      if (!productAttestationLog?.data) {
        throw new Error(
          `Product attestation log not found. Expected schema: ${productSchemaUID}. Hash: ${txHash}`
        )
      }

      console.log("Product attestation UID:", productAttestationLog.data)
      return productAttestationLog.data
    } catch (error) {
      // Enhanced error context
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      const context = {
        function: "createProductAttestation",
        smartWalletAddress,
        chainId,
        productSalt,
      }

      console.error("Product attestation failed:", {
        error: errorMessage,
        context,
      })
      throw new Error(`Product attestation failed: ${errorMessage}`)
    }
  }

  /**
   * Create product attestations
   */
  const createProductVariationAttestation = async (
    productUId: string
  ): Promise<{
    variationUId: `0x${string}`
  }> => {
    console.log("productUId:", productUId)
    // Generate random IDs for variation
    const variationSalt = generateSaltFromKey(smartWalletAddress, "variation")

    // Attest to variation schema
    const variationAttestationCall = EASService.createVariationAttestationCall(
      chainId,
      {
        variationSalt: variationSalt,
      },
      { refUID: productUId }
    )
    console.log("variationAttestationCall:", variationAttestationCall)

    try {
      const txBuilder = new TransactionBuilder()
      txBuilder.addCalls([variationAttestationCall])
      const txHash = await executeTransaction(txBuilder.getCalls())
      if (!txHash) {
        throw new Error("Failed to create attestations referencing product")
      }

      const receipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      })
      if (!receipt?.logs) {
        throw new Error("Failed to create attestations referencing product")
      }
      // Find EAS logs
      const easLogs = receipt.logs.filter((log) => log.address === easAddress)
      if (easLogs.length === 0) {
        throw new Error("No EAS logs found in transaction")
      }

      // Look for variation schema attestation
      const variationSchemaUID = getSchemaUID(SchemaName.VARIATION, chainId)
      const variationLog = easLogs.find(
        (log) => log.topics[3] === variationSchemaUID
      )
      if (!variationLog) {
        throw new Error("Variation attestation log not found")
      }

      return {
        variationUId: variationLog.data,
      }
    } catch (error) {
      console.error("Failed to create attestations referencing product:", error)
      throw error
    }
  }

  /**
   * Create product attestations
   */
  const createAttestationsReferencingVariation = (
    variationUId: `0x${string}`,
    storeId: string,
    name: string,
    descriptionContentHash: `0x${string}` | null,
    mediaManifestContentHash: `0x${string}` | null,
    returnWindow: `0x${string}`,
    returnPolicy: `0x${string}`,
    shipping: `0x${string}`,
    sku: string,
    upc: string
  ): {
    calls: Call[]
  } => {
    console.log("variationUId:", variationUId)
    const calls: Call[] = []

    if (!storeId) {
      throw new Error("Store UId is required")
    }

    const storeIdAttestationCall = EASService.createStoreIdAttestationCall(
      chainId,
      { storeId: storeId },
      { refUID: variationUId }
    )
    console.log("storeIdAttestationCall:", storeIdAttestationCall)
    calls.push(storeIdAttestationCall)

    if (name) {
      const nameAttestationCall = EASService.createNameAttestationCall(
        chainId,
        { name: name },
        { refUID: variationUId }
      )
      console.log("nameAttestationCall:", nameAttestationCall)
      calls.push(nameAttestationCall)
    }

    if (descriptionContentHash) {
      const descriptionAttestationCall =
        EASService.createDescriptionAttestationCall(
          chainId,
          {
            descriptionContentHash: descriptionContentHash,
          },
          { refUID: variationUId }
        )
      console.log("descriptionAttestationCall:", descriptionAttestationCall)
      calls.push(descriptionAttestationCall)
    }

    if (mediaManifestContentHash) {
      const mediaManifestAttestationCall =
        EASService.createMediaManifestAttestationCall(
          chainId,
          {
            mediaManifestContentHash: mediaManifestContentHash,
          },
          { refUID: variationUId }
        )
      console.log("mediaManifestAttestationCall:", mediaManifestAttestationCall)
      calls.push(mediaManifestAttestationCall)
    }

    if (returnWindow) {
      const returnWindowAttestationCall =
        EASService.createReturnWindowAttestationCall(
          chainId,
          { returnWindowContentHash: returnWindow },
          { refUID: variationUId }
        )
      console.log("returnWindowAttestationCall:", returnWindowAttestationCall)
      calls.push(returnWindowAttestationCall)
    }

    if (returnPolicy) {
      const returnPolicyAttestationCall =
        EASService.createReturnPolicyAttestationCall(
          chainId,
          { returnPolicyContentHash: returnPolicy },
          { refUID: variationUId }
        )
      console.log("returnPolicyAttestationCall:", returnPolicyAttestationCall)
      calls.push(returnPolicyAttestationCall)
    }

    if (shipping) {
      const shippingAttestationCall =
        EASService.createShippingCostTypeAttestationCall(
          chainId,
          { shippingCostTypeContentHash: shipping },
          { refUID: variationUId }
        )
      console.log("shippingAttestationCall:", shippingAttestationCall)
      calls.push(shippingAttestationCall)
    }

    if (sku) {
      const skuAttestationCall = EASService.createSkuAttestationCall(
        chainId,
        { sku: sku },
        { refUID: variationUId }
      )
      console.log("skuAttestationCall:", skuAttestationCall)
      calls.push(skuAttestationCall)
    }

    if (upc) {
      const upcAttestationCall = EASService.createUpcAttestationCall(
        chainId,
        { upc: upc },
        { refUID: variationUId }
      )
      console.log("upcAttestationCall:", upcAttestationCall)
      calls.push(upcAttestationCall)
    }

    return {
      calls,
    }
  }

  /**
   * Set price
   */
  const setPrice = (
    priceContractAddress: `0x${string}`,
    variationUId: `0x${string}`,
    price: number
  ): {
    calls: Call[]
  } => {
    // convert price to smallest unit (6 decimals for USDC)
    const priceInSmallestUnit = BigInt(price * 10 ** 6)
    const { calls } = PriceService.createSetPriceCall(priceContractAddress, {
      variationUId,
      amount: priceInSmallestUnit,
      paymentToken: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
    })
    return {
      calls,
    }
  }

  /**
   * Set inventory
   */
  const setInventory = (
    inventoryContractAddress: `0x${string}`,
    variationUId: `0x${string}`,
    inventory: number
  ): {
    calls: Call[]
  } => {
    const { calls } = InventoryService.createUpdateAvailableQuantityCall(
      inventoryContractAddress,
      {
        variationUId,
        inventory,
      }
    )
    return {
      calls,
    }
  }

  /**
   * Create product
   * This is the main function that orchestrates the entire workflow
   */
  const createProduct = async (
    data: ProductCreationInput
  ): Promise<{
    productUId: `0x${string}`
    variationUId: `0x${string}`
    descriptionContentHash: `0x${string}` | null
    mediaManifestContentHash: `0x${string}` | null
  }> => {
    if (!priceContract) {
      throw new Error("Price contract not found")
    }
    if (!inventoryContract) {
      throw new Error("Inventory contract not found")
    }
    try {
      const [descriptionContentHash, mediaManifestContentHash, productUId] =
        await Promise.all([
          uploadProductDescriptionToIPFS(data.description),
          createAndUploadMediaManifestToIPFS(data.images, data.uploadedResults),
          createProductAttestation(),
        ])
      console.log("descriptionContentHash:", descriptionContentHash)
      console.log("mediaManifestContentHash:", mediaManifestContentHash)
      console.log("productUId:", productUId)

      // create attestations referencing the product
      const { variationUId } =
        await createProductVariationAttestation(productUId)
      console.log("variationUId:", variationUId)

      // wait for 1 second to make sure the variation attestation is indexed by alchemy. todo: come back to this
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // create attestations referencing the variation
      const { calls: variationReferencingCalls } =
        createAttestationsReferencingVariation(
          variationUId,
          data.storeId,
          data.name,
          descriptionContentHash,
          mediaManifestContentHash,
          data.returnWindow,
          data.returnPolicy,
          data.shipping,
          data.sku,
          data.upc
        )

      // set price
      const { calls: priceCalls } = setPrice(
        priceContract,
        variationUId,
        data.price
      )

      // set inventory
      const { calls: inventoryCalls } = setInventory(
        inventoryContract,
        variationUId,
        data.inventory
      )

      // add the rest of the calls to the transaction builder
      const txBuilder = new TransactionBuilder()
      txBuilder.addCalls([
        ...priceCalls,
        ...inventoryCalls,
        ...variationReferencingCalls,
      ])

      // execute the transaction
      const txHash = await executeTransaction(txBuilder.getCalls())
      if (!txHash) {
        throw new Error("Failed to create product")
      }
      const receipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      })
      console.log("Transaction receipt:", receipt)

      return {
        productUId,
        variationUId,
        descriptionContentHash,
        mediaManifestContentHash,
      }
    } catch (error) {
      // Error handling is done in each function
      console.error("Product creation failed:", error)
      throw error
    }
  }

  /**
   * Reset the workflow
   */
  const reset = () => {
    setState({
      step: ProductCreationStep.IDLE,
      orderPaidPluginResolverAddress: null,
      productUId: null,
      variationUId: null,
      error: null,
    })
  }

  return {
    createProduct,
    reset,
    state,
    error: state.error || error,
    client,
  }
}
