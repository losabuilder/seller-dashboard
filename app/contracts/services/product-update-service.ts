import { Call } from "viem"
// Removed unused import: StoreAttestationMetadata
import { EASService } from "./eas-service"
import { PriceService } from "./price-service"
import { InventoryService } from "./inventory-service"
import { StorachaService, type UploadResult } from "@/app/services/storacha-service"

// Media manifest types (imported from product creation workflow)
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

// Product update data structure
export type ProductUpdateData = {
  name?: string
  description?: string
  mediaManifest?: string // Content hash
  returnWindow?: `0x${string}`
  returnPolicy?: `0x${string}`
  shipping?: `0x${string}`
  sku?: string
  upc?: string
  price?: number
  inventory?: number
  // For image updates
  images?: string[] // Array of content hashes
  uploadedResults?: (UploadResult & { uniqueId: string })[] // Uploaded file results
}

// Product attestation metadata mapping
export type ProductAttestationMetadata = {
  uid: `0x${string}`
  schemaId: `0x${string}`
}

/**
 * Service for handling product updates via attestations and contracts
 */
export class ProductUpdateService {
  /**
   * Upload product description to IPFS using Storacha
   */
  static async uploadProductDescriptionToIPFS(
    description: string
  ): Promise<`0x${string}` | null> {
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
  static async createAndUploadMediaManifestToIPFS(
    images: string[],
    uploadedResults: (UploadResult & { uniqueId: string })[]
  ): Promise<`0x${string}` | null> {
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
   * Create product update calls for changed fields
   */
  static async createProductUpdateCalls(
    chainId: number,
    updates: ProductUpdateData,
    attestationMetadata: Record<keyof Omit<ProductUpdateData, 'price' | 'inventory'>, ProductAttestationMetadata | null>,
    variationId: `0x${string}`,
    priceContract?: `0x${string}`,
    inventoryContract?: `0x${string}`
  ): Promise<Call[]> {
    const calls: Call[] = []

    // Handle name updates
    if (updates.name !== undefined) {
      if (attestationMetadata.name) {
        // Revoke existing name attestation
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          attestationMetadata.name.uid,
          attestationMetadata.name.schemaId
        )
        calls.push(revokeCall)
      }

      // Create new name attestation
      const nameCall = EASService.createNameAttestationCall(
        chainId,
        { name: updates.name },
        { refUID: variationId }
      )
      calls.push(nameCall)
    }

    // Handle description updates
    if (updates.description !== undefined) {
      if (attestationMetadata.description) {
        // Revoke existing description attestation
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          attestationMetadata.description.uid,
          attestationMetadata.description.schemaId
        )
        calls.push(revokeCall)
      }

      // Create new description attestation
      if (updates.description) {
        // Upload description to IPFS first
        const descriptionContentHash = await this.uploadProductDescriptionToIPFS(updates.description)
        if (descriptionContentHash) {
          const descriptionCall = EASService.createDescriptionAttestationCall(
            chainId,
            { descriptionContentHash },
            { refUID: variationId }
          )
          calls.push(descriptionCall)
        }
      }
    }

    // Handle media manifest updates
    if (updates.images !== undefined || updates.mediaManifest !== undefined) {
      if (attestationMetadata.mediaManifest) {
        // Revoke existing media manifest attestation
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          attestationMetadata.mediaManifest.uid,
          attestationMetadata.mediaManifest.schemaId
        )
        calls.push(revokeCall)
      }

      // Create new media manifest attestation
      let mediaManifestContentHash: `0x${string}` | null = null

      // If images and uploadedResults are provided, create new media manifest
      if (updates.images && updates.uploadedResults) {
        mediaManifestContentHash = await this.createAndUploadMediaManifestToIPFS(
          updates.images,
          updates.uploadedResults
        )
      } else if (updates.mediaManifest) {
        // Use provided media manifest content hash
        mediaManifestContentHash = updates.mediaManifest as `0x${string}`
      }

      // Create attestation if we have a content hash
      if (mediaManifestContentHash) {
        const mediaCall = EASService.createMediaManifestAttestationCall(
          chainId,
          { mediaManifestContentHash },
          { refUID: variationId }
        )
        calls.push(mediaCall)
      }
    }

    // Handle return window updates
    if (updates.returnWindow !== undefined) {
      if (attestationMetadata.returnWindow) {
        // Revoke existing return window attestation
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          attestationMetadata.returnWindow.uid,
          attestationMetadata.returnWindow.schemaId
        )
        calls.push(revokeCall)
      }

      // Create new return window attestation
      const returnWindowCall = EASService.createReturnWindowAttestationCall(
        chainId,
        { returnWindowContentHash: updates.returnWindow },
        { refUID: variationId }
      )
      calls.push(returnWindowCall)
    }

    // Handle return policy updates
    if (updates.returnPolicy !== undefined) {
      if (attestationMetadata.returnPolicy) {
        // Revoke existing return policy attestation
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          attestationMetadata.returnPolicy.uid,
          attestationMetadata.returnPolicy.schemaId
        )
        calls.push(revokeCall)
      }

      // Create new return policy attestation
      const returnPolicyCall = EASService.createReturnPolicyAttestationCall(
        chainId,
        { returnPolicyContentHash: updates.returnPolicy },
        { refUID: variationId }
      )
      calls.push(returnPolicyCall)
    }

    // Handle shipping updates
    if (updates.shipping !== undefined) {
      if (attestationMetadata.shipping) {
        // Revoke existing shipping attestation
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          attestationMetadata.shipping.uid,
          attestationMetadata.shipping.schemaId
        )
        calls.push(revokeCall)
      }

      // Create new shipping attestation
      const shippingCall = EASService.createShippingCostTypeAttestationCall(
        chainId,
        { shippingCostTypeContentHash: updates.shipping },
        { refUID: variationId }
      )
      calls.push(shippingCall)
    }

    // Handle SKU updates
    if (updates.sku !== undefined) {
      if (attestationMetadata.sku) {
        // Revoke existing SKU attestation
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          attestationMetadata.sku.uid,
          attestationMetadata.sku.schemaId
        )
        calls.push(revokeCall)
      }

      // Create new SKU attestation
      if (updates.sku) {
        const skuCall = EASService.createSkuAttestationCall(
          chainId,
          { sku: updates.sku },
          { refUID: variationId }
        )
        calls.push(skuCall)
      }
    }

    // Handle UPC updates
    if (updates.upc !== undefined) {
      if (attestationMetadata.upc) {
        // Revoke existing UPC attestation
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          attestationMetadata.upc.uid,
          attestationMetadata.upc.schemaId
        )
        calls.push(revokeCall)
      }

      // Create new UPC attestation
      if (updates.upc) {
        const upcCall = EASService.createUpcAttestationCall(
          chainId,
          { upc: updates.upc },
          { refUID: variationId }
        )
        calls.push(upcCall)
      }
    }

    // Handle price updates
    if (updates.price !== undefined && priceContract) {
      // Convert price to smallest unit (6 decimals for USDC)
      // Round to prevent floating point precision issues with BigInt conversion
      const priceInSmallestUnit = BigInt(Math.round(updates.price * 10 ** 6))
      const { calls: priceCalls } = PriceService.createSetPriceCall(priceContract, {
        variationUId: variationId,
        amount: priceInSmallestUnit,
        paymentToken: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
      })
      calls.push(...priceCalls)
    }

    // Handle inventory updates
    if (updates.inventory !== undefined && inventoryContract) {
      const { calls: inventoryCalls } = InventoryService.createUpdateAvailableQuantityCall(
        inventoryContract,
        {
          variationUId: variationId,
          inventory: updates.inventory,
        }
      )
      calls.push(...inventoryCalls)
    }

    return calls
  }
}