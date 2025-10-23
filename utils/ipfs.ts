import { decode } from "@ensdomains/content-hash"
import * as dagCbor from "@ipld/dag-cbor"
import bs58 from "bs58"
import { fromHex } from "viem"

import { fetchDagCborWithRetry, fetchWithGatewayRetry } from "./ipfs-retry"

/**
 * Convert IPFS URI to HTTPS URI.
 *
 * @param ipfsURI An ipfs protocol URI.
 * @param gateway The IPFS gateway to use. Defaults to ipfs.io, a free public gateway.
 *                For production use, you'll likely want a paid provider.
 * @returns An HTTPS URI that points to the data represented by the cid
 * embedded in the ipfs URI.
 */
export const ipfsToHTTP = function (ipfsURI: string, gateway = "ipfs.io") {
  if (ipfsURI.startsWith("http")) {
    return ipfsURI.replace("http://", "https://")
  }
  // IPNS Name is a Multihash of a serialized PublicKey.
  const cid = ipfsURI.replace("ipfs://", "")

  // Addresses using a gateway use the following form,
  // where <gateway> is the gateway address,
  // and <CID> is the content identifier.
  return `https://${gateway}/ipfs/${cid}`
}

// Re-export from ipfs-gateways for backward compatibility
export { getIpfsGatewayUrl } from "./ipfs-gateways"

/**
 * Convert contentHash (EIP-1577 format) back to CID for display purposes
 * @param contentHash The contentHash in hex format (0x...)
 * @returns The CID string
 */
export const contentHashToCid = (contentHash: string): string => {
  try {
    // Remove 0x prefix if present
    const hexString = contentHash.startsWith("0x")
      ? contentHash.slice(2)
      : contentHash

    // Decode the contentHash to get the CID
    const cid = decode(`0x${hexString}`)

    return cid
  } catch (error) {
    console.error("Failed to decode contentHash to CID:", error)
    throw new Error(`Invalid contentHash format: ${contentHash}`)
  }
}

// Return bytes32 hex string from base58 encoded ipfs hash,
// stripping leading 2 bytes from 34 byte IPFS hash
// Assume IPFS defaults: function:0x12=sha2, size:0x20=256 bits
// E.g. "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL" -->
// "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"

export const getBytes32FromIpfsHash = (ipfsListing: string) => {
  return "0x" + Buffer.from(bs58.decode(ipfsListing).slice(2)).toString("hex")
}

// Return base58 encoded ipfs hash from bytes32 hex string,
// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"

export const getIpfsHashFromBytes32 = (bytes32Hex: string) => {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, "hex")
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}

export const getBytesFromIpfsHash = (ipfsHash: string) => {
  const encoder = new TextEncoder()
  const ipfsHashBytes = encoder.encode(ipfsHash)
  return ipfsHashBytes
}

export const getHexFromBytes = (bytes: Uint8Array) => {
  return (
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  )
}

// Convert hex string back to bytes
export const getBytesFromHex = (hex: string): Uint8Array => {
  // Remove 0x prefix if present
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex

  // Create a new Uint8Array with the correct length
  const bytes = new Uint8Array(cleanHex.length / 2)

  // Convert each pair of hex characters to a byte
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16)
  }

  return bytes
}

// Convert bytes back to IPFS hash string
export const getIpfsHashFromBytes = (bytes: Uint8Array): string => {
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

// Utility function to extract IPFS hash from contract response
export const getIpfsHashFromContractResponse = (hexData: string): string => {
  // Remove 0x prefix if present
  const cleanHex = hexData.startsWith("0x") ? hexData.slice(2) : hexData

  // Convert hex to bytes
  const bytes = getBytesFromHex(cleanHex)

  // Convert bytes to IPFS hash string
  return getIpfsHashFromBytes(bytes)
}

// Helper function to convert hex-encoded IPFS hash back to base58 format
export const getIpfsHashFromHex = (hexData: `0x${string}`): string => {
  if (!hexData.startsWith("0x")) {
    return hexData // Already in base58 format
  }

  // Convert hex to bytes using Viem
  const bytes = fromHex(hexData, "bytes")

  // Decode bytes back to the original IPFS hash string
  const decoder = new TextDecoder()
  const ipfsHash = decoder.decode(bytes)

  return ipfsHash
}

// Fetch content from a contentHash with graceful fallbacks:
// 1) Try DAG-CBOR decode
// 2) If that fails, parse as JSON if possible
// 3) Otherwise, return as UTF-8 text
export async function fetchContentFromContentHash<T = unknown>(
  contentHash: string
): Promise<T> {
  const cid = contentHashToCid(contentHash)

  // 1) Try raw DAG-CBOR first
  try {
    const response = await fetchDagCborWithRetry(cid)
    const bytes = new Uint8Array(await response.arrayBuffer())
    return dagCbor.decode(bytes) as T
  } catch {
    // DAG-CBOR failed, try plain text/JSON fallback
  }

  // 2) Fallback: fetch as JSON/text
  const response = await fetchWithGatewayRetry(cid)
  const text = await response.text()

  try {
    return JSON.parse(text) as T
  } catch {
    return text as unknown as T
  }
}
