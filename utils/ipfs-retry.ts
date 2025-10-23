import { IPFS_GATEWAYS, type SupportedGateway, getIpfsGatewayUrl } from "./ipfs-gateways"

/**
 * Generic utility for retrying operations across multiple IPFS gateways
 * @param cid The IPFS content identifier
 * @param operation Function that takes a gateway URL and returns a Promise
 * @param gateways Array of gateways to try (defaults to primary gateways)
 * @returns Promise that resolves with the first successful result
 */
export async function withGatewayRetry<T>(
  cid: string,
  operation: (gatewayUrl: string) => Promise<T>,
  gateways: readonly SupportedGateway[] = IPFS_GATEWAYS.primary
): Promise<T> {
  let lastError: unknown = null

  for (const gateway of gateways) {
    try {
      const gatewayUrl = getIpfsGatewayUrl(cid, gateway)
      const result = await operation(gatewayUrl)
      return result
    } catch (error) {
      lastError = error
      // Continue to next gateway
    }
  }

  // All gateways failed
  throw new Error(
    `Failed to fetch from all IPFS gateways for CID ${cid}: ${String(
      (lastError as Error | undefined)?.message ?? "unknown error"
    )}`
  )
}

/**
 * Fetch content from IPFS with DAG-CBOR decoding and gateway retry
 * @param cid The IPFS content identifier
 * @param options Fetch options
 * @returns Promise that resolves with the response
 */
export async function fetchWithGatewayRetry(
  cid: string,
  options: RequestInit = {}
): Promise<Response> {
  return withGatewayRetry(cid, async (gatewayUrl) => {
    const response = await fetch(gatewayUrl, {
      cache: "no-store",
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  })
}

/**
 * Fetch DAG-CBOR content from IPFS with gateway retry
 * @param cid The IPFS content identifier
 * @param options Fetch options
 * @returns Promise that resolves with the response for DAG-CBOR decoding
 */
export async function fetchDagCborWithRetry(
  cid: string,
  options: RequestInit = {}
): Promise<Response> {
  return withGatewayRetry(cid, async (gatewayUrl) => {
    const rawUrl = `${gatewayUrl}?format=raw`
    const response = await fetch(rawUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.ipld.dag-cbor,application/octet-stream",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  })
}