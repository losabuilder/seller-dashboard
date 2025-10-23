import { Address } from "viem"
import type { StoreAttestationMetadata } from "./eas"

// Media manifest structure
export interface MediaManifestItem {
  role: "hero" | "detail"
  mime: string
  alt: string
  width?: number
  height?: number
}

export interface MediaManifest {
  ordering: string[]
  items: Record<string, MediaManifestItem>
}

// Product attestations structure
export interface ProductAttestations {
  name?: StoreAttestationMetadata | null
  description?: StoreAttestationMetadata | null
  mediaManifest?: StoreAttestationMetadata | null
  returnWindow?: StoreAttestationMetadata | null
  returnPolicy?: StoreAttestationMetadata | null
  shipping?: StoreAttestationMetadata | null
  sku?: StoreAttestationMetadata | null
  upc?: StoreAttestationMetadata | null
  storeId?: StoreAttestationMetadata | null
}

// Raw product data from EAS (before IPFS resolution)
export interface RawProductData {
  // Core product data (some fields are content hashes before resolution)
  name: string
  descriptionContentHash: string  // IPFS content hash
  mediaManifestContentHash: string | null  // IPFS content hash
  returnWindow: string
  returnPolicy: string
  shipping: string
  sku: string
  upc: string
  storeId: string

  // Variation reference
  variationId: string

  // Attestation metadata
  attestations: ProductAttestations
}

// Product info structure (after IPFS resolution)
export interface ProductInfo {
  // Core product data (resolved from IPFS where applicable)
  name: string
  description: string  // Resolved from IPFS
  mediaManifest: MediaManifest | null  // Resolved from IPFS
  returnWindow: string
  returnPolicy: string
  shipping: string
  sku: string
  upc: string
  storeId: string

  // Contract data (from price/inventory contracts)
  price?: number
  inventory?: number

  // Variation reference
  variationId: string

  // Attestation metadata - for blockchain operations
  attestations: ProductAttestations

  // UI state
  loading: {
    eas: boolean
    contract: boolean
  }
}

// Product data structure (extended with contract info)
export interface ProductData extends ProductInfo {
  // Additional contract-related data
  priceContract?: Address
  inventoryContract?: Address

  // Loading states per data type
  easDataLoading?: boolean
  contractDataLoading?: boolean
}

// Product list item for API responses
export interface ProductListItem {
  id: string // Product UID
  variationId: string // Variation UID
  data: ProductInfo
}