import { useState, useEffect, useCallback } from "react"
import { buildExtendedGatewayUrls } from "@/utils/ipfs-gateways"

export interface UseIpfsImageResult {
  /** Current image source URL */
  src: string | null
  /** Whether gateway URLs are being generated */
  isInitializing: boolean
  /** Whether all gateways have failed */
  isError: boolean
  /** Current gateway index being used */
  currentGatewayIndex: number
  /** Retry loading the image (resets to first gateway) */
  retry: () => void
  /** Handle image load success */
  onLoad: () => void
  /** Handle image load error (tries next gateway) */
  onError: () => void
}

/**
 * React hook for loading IPFS images with automatic gateway fallback
 * @param cid The IPFS content identifier
 * @returns Object with image source, loading state, and handlers
 */
export function useIpfsImage(cid: string): UseIpfsImageResult {
  const [currentGatewayIndex, setCurrentGatewayIndex] = useState(0)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isError, setIsError] = useState(false)
  const [gatewayUrls, setGatewayUrls] = useState<string[]>([])

  // Build gateway URLs when CID changes
  useEffect(() => {
    if (cid) {
      setIsInitializing(true)
      const urls = buildExtendedGatewayUrls(cid)
      setGatewayUrls(urls)
      setCurrentGatewayIndex(0)
      setIsError(false)
      setIsInitializing(false)
    } else {
      setGatewayUrls([])
      setCurrentGatewayIndex(0)
      setIsInitializing(false)
      setIsError(false)
    }
  }, [cid])

  const currentSrc = gatewayUrls[currentGatewayIndex] || null

  const handleLoad = useCallback(() => {
    setIsError(false)
  }, [])

  const handleError = useCallback(() => {
    const nextIndex = currentGatewayIndex + 1

    if (nextIndex < gatewayUrls.length) {
      // Try next gateway
      setCurrentGatewayIndex(nextIndex)
    } else {
      // All gateways failed
      setIsError(true)
      console.warn(`All IPFS gateways failed for CID: ${cid}`)
    }
  }, [currentGatewayIndex, gatewayUrls.length, cid])

  const retry = useCallback(() => {
    if (gatewayUrls.length > 0) {
      setCurrentGatewayIndex(0)
      setIsError(false)
    }
  }, [gatewayUrls.length])

  return {
    src: currentSrc,
    isInitializing,
    isError,
    currentGatewayIndex,
    retry,
    onLoad: handleLoad,
    onError: handleError,
  }
}