/**
 * Central configuration for IPFS gateways and URL building
 */

export type SupportedGateway = "storacha" | "ipfs.io" | "pinata"

export const IPFS_GATEWAYS = {
  // Primary gateways - used in utils functions for fetching content
  primary: ["storacha", "ipfs.io", "pinata"] as const satisfies readonly SupportedGateway[],

  // Extended gateways - includes additional fallbacks for UI components
  extended: [
    "storacha",
    "ipfs.io",
    "pinata",
    "cloudflare",
    "filebase",
    "dweb"
  ] as const,
} as const

/**
 * Generate IPFS gateway URL for a CID using a specific gateway
 * @param cid The content identifier
 * @param gateway The gateway to use (defaults to "storacha")
 * @returns The gateway URL
 */
export function getIpfsGatewayUrl(
  cid: string,
  gateway: SupportedGateway = "storacha"
): string {
  switch (gateway) {
    case "storacha":
      // Use subdomain format for potentially better performance/caching
      return `https://${cid}.ipfs.storacha.link/`
    case "ipfs.io":
      return `https://ipfs.io/ipfs/${cid}`
    case "pinata":
      return `https://gateway.pinata.cloud/ipfs/${cid}`
    default:
      return `https://${cid}.ipfs.storacha.link/`
  }
}

/**
 * Build array of gateway URLs for a CID with extended fallbacks
 * @param cid The content identifier
 * @returns Array of gateway URLs to try in order
 */
export function buildExtendedGatewayUrls(cid: string): string[] {
  return [
    // Supported gateways from utils
    getIpfsGatewayUrl(cid, "storacha"),
    getIpfsGatewayUrl(cid, "ipfs.io"),
    getIpfsGatewayUrl(cid, "pinata"),
    // Additional fallback gateways
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://ipfs.filebase.io/ipfs/${cid}`,
    `https://dweb.link/ipfs/${cid}`,
  ]
}

/**
 * Build array of primary gateway URLs for a CID
 * @param cid The content identifier
 * @returns Array of primary gateway URLs
 */
export function buildPrimaryGatewayUrls(cid: string): string[] {
  return IPFS_GATEWAYS.primary.map(gateway => getIpfsGatewayUrl(cid, gateway))
}