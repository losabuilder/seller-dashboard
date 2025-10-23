import { Address } from "viem";



import type { StoreAttestationMetadata } from "./eas";


// Store info structure (from EAS data)
export interface StoreInfo {
  name: string
  description: string
  logoContentHash: string
  email: string
  website: string
  orderContract: Address
  attestations: {
    name: StoreAttestationMetadata | null
    description: StoreAttestationMetadata | null
    logoContentHash: StoreAttestationMetadata | null
    email: StoreAttestationMetadata | null
    website: StoreAttestationMetadata | null
    orderContract: StoreAttestationMetadata | null
  }
  // todo: can we remove this?
  // loading: {
  //   eas: boolean
  //   contract: boolean
  // }
}

// Extended store info (includes contract data)
export interface StoreData {
  // EAS Data (fetched via GraphQL)
  name?: string
  description?: string
  logoContentHash?: string | null
  email?: string
  website?: string
  orderContract?: Address

  // Attestation metadata - for blockchain operations
  attestations?: {
    [K in
      | "name"
      | "description"
      | "logoContentHash"
      | "email"
      | "website"
      | "orderContract"]?: StoreAttestationMetadata | null
  }

  // Contract Data (fetched via contract calls using orderContract)
  orderPaidSchema?: `0x${string}`
  refundSchema?: `0x${string}`
  priceContract?: Address
  inventoryContract?: Address
  plugins?: Address[]

  // Loading states per data type
  easDataLoading?: boolean
  contractDataLoading?: boolean
}

// Attestations structure for store data
export interface StoreAttestations {
  name?: StoreAttestationMetadata | null
  description?: StoreAttestationMetadata | null
  logoContentHash?: StoreAttestationMetadata | null
  email?: StoreAttestationMetadata | null
  website?: StoreAttestationMetadata | null
  orderContract?: StoreAttestationMetadata | null
}

// Store list item for API responses
export interface StoreListItem {
  id: string
  data: StoreInfo
}