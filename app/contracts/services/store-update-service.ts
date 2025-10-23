import { Call } from "viem"

import { StorachaService } from "@/app/services/storacha-service"

import { SchemaName } from "../config/types"
import { getSchemaUID } from "../config/utils"
import { EASService } from "./eas-service"

export type StoreUpdateData = {
  name?: string
  description?: string
  email?: string
  website?: string
  logoContentHash?: string
}

export type StoreAttestationMetadata = {
  uid: `0x${string}`
  schemaId: `0x${string}`
}

export class StoreUpdateService {
  /**
   * Upload store description to IPFS and return content hash
   */
  static async uploadStoreDescription(
    description: string
  ): Promise<`0x${string}`> {
    try {
      const result = await StorachaService.uploadText(description)
      console.log("Store description uploaded to Storacha:", result.cid)
      return result.contentHash
    } catch (error) {
      console.error("Failed to upload store description to Storacha:", error)
      throw new Error("Failed to upload store description to IPFS")
    }
  }

  /**
   * Create transaction calls to update store information
   * This follows the revoke + recreate pattern for EAS attestations
   */
  static async createStoreUpdateCalls(
    chainId: number,
    updates: StoreUpdateData,
    attestationMetadata: Record<
      keyof StoreUpdateData,
      StoreAttestationMetadata | null
    >,
    storeCreationUID: string
  ): Promise<Call[]> {
    const calls: Call[] = []

    // Handle description upload first if needed
    let descriptionContentHash: string | undefined
    if (updates.description !== undefined) {
      if (updates.description !== "") {
        descriptionContentHash = await this.uploadStoreDescription(
          updates.description
        )
      }
    }

    // For each field being updated, we need to:
    // 1. Revoke the existing attestation (if it exists)
    // 2. Create a new attestation with the updated value

    for (const [field, newValue] of Object.entries(updates)) {
      // Skip if no change (undefined)
      if (newValue === undefined) continue

      const fieldKey = field as keyof StoreUpdateData
      const existingAttestation = attestationMetadata[fieldKey]

      // If there's an existing attestation, revoke it first
      if (existingAttestation?.uid) {
        const revokeCall = EASService.createRevokeAttestationCall(
          chainId,
          existingAttestation.uid,
          existingAttestation.schemaId
        )
        calls.push(revokeCall)
      }

      // Only create new attestation if there's a new value (not empty string)
      if (newValue !== "") {
        let valueToUse = newValue

        // Special handling for description - use the uploaded content hash
        if (fieldKey === "description") {
          if (descriptionContentHash) {
            valueToUse = descriptionContentHash
          } else {
            continue // Skip if no content hash was generated
          }
        }

        const newAttestationCall = this.createFieldAttestationCall(
          chainId,
          fieldKey,
          valueToUse,
          storeCreationUID
        )
        calls.push(newAttestationCall)
      }
      // If newValue is empty string, we only revoke (don't create new attestation)
    }

    return calls
  }

  /**
   * Create an attestation call for a specific field
   */
  private static createFieldAttestationCall(
    chainId: number,
    field: keyof StoreUpdateData,
    value: string,
    storeCreationUID: string
  ): Call {
    const attestationData = { refUID: storeCreationUID as `0x${string}` }

    switch (field) {
      case "name":
        return EASService.createNameAttestationCall(
          chainId,
          { name: value },
          attestationData
        )
      case "description":
        return EASService.createDescriptionAttestationCall(
          chainId,
          { descriptionContentHash: value },
          attestationData
        )
      case "email":
        return EASService.createEmailAttestationCall(
          chainId,
          { email: value },
          attestationData
        )
      case "website":
        return EASService.createWebsiteAttestationCall(
          chainId,
          { website: value },
          attestationData
        )
      case "logoContentHash":
        return EASService.createLogoAttestationCall(
          chainId,
          { logoContentHash: value },
          attestationData
        )
      default:
        throw new Error(`Unsupported field: ${field}`)
    }
  }

  /**
   * Create transaction call to delete a store by revoking its attestation
   */
  static createStoreDeletionCall(
    chainId: number,
    storeAttestationUID: `0x${string}`
  ): Call {
    const schemaUID = getSchemaUID(SchemaName.STORE, chainId)
    return EASService.createRevokeAttestationCall(
      chainId,
      storeAttestationUID,
      schemaUID
    )
  }
}
