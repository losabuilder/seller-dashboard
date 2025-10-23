import { fetchContentFromContentHash } from "@/utils/ipfs"
import type { Address } from "viem"
import type {
  DecodedDataItem,
  Attestation,
  GraphQLResponse,
} from "@/types/eas"
import type { StoreInfo } from "@/types/store"

export async function fetchStoreData(
  storeId: string,
  easscanGraphqlEndpoint: string
): Promise<StoreInfo> {
  const response = await fetch(easscanGraphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetStoreData($where: AttestationWhereInput) {
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
                equals: storeId,
              },
            },
            {
              OR: [
                { schemaId: { equals: process.env.ORDER_CONTRACT_SCHEMA_UID } },
                { schemaId: { equals: process.env.NAME_SCHEMA_UID } },
                { schemaId: { equals: process.env.DESCRIPTION_SCHEMA_UID } },
                { schemaId: { equals: process.env.LOGO_SCHEMA_UID } },
                { schemaId: { equals: process.env.WEBSITE_SCHEMA_UID } },
                { schemaId: { equals: process.env.EMAIL_SCHEMA_UID } },
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

  const storeData: GraphQLResponse = await response.json()

  // Parse the decoded data and build store object with new structure
  const storeInfo: StoreInfo = {
    // Core store data - direct access
    name: "",
    description: "",
    logoContentHash: "",
    email: "",
    website: "",
    orderContract: "" as Address,

    // Attestation metadata - only what we need
    attestations: {
      name: null,
      description: null,
      logoContentHash: null,
      email: null,
      website: null,
      orderContract: null,
    },
  }

  // Process each attestation to extract store data and metadata
  storeData.data.attestations.forEach((attestation: Attestation) => {
    try {
      const decodedData: DecodedDataItem[] = JSON.parse(attestation.decodedDataJson)

      // Extract data based on the attestation type
      decodedData.forEach((item: DecodedDataItem) => {
        if (item.name === "orderContract" && item.value?.value) {
          storeInfo.orderContract = item.value.value as Address
          storeInfo.attestations.orderContract = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (item.name === "name" && item.value?.value) {
          storeInfo.name = item.value.value
          storeInfo.attestations.name = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (
          item.name === "descriptionContentHash" &&
          item.value?.value
        ) {
          storeInfo.description = item.value.value
          storeInfo.attestations.description = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (item.name === "logoContentHash" && item.value?.value) {
          storeInfo.logoContentHash = item.value.value
          storeInfo.attestations.logoContentHash = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (item.name === "email" && item.value?.value) {
          storeInfo.email = item.value.value
          storeInfo.attestations.email = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        } else if (item.name === "website" && item.value?.value) {
          storeInfo.website = item.value.value
          storeInfo.attestations.website = {
            uid: attestation.id,
            schemaId: attestation.schemaId,
          }
        }
      })
    } catch (error) {
      console.error("Failed to parse attestation data:", error)
    }
  })

  if (storeInfo.description) {
    storeInfo.description = await fetchContentFromContentHash(
      storeInfo.description
    )
  }

  return storeInfo
}
