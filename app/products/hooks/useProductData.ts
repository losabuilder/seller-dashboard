import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from "react"
import type { ProductInfo } from "@/types/product"

interface UseProductDataProps {
  productId: string
  activeStoreId: string | null
  storeData: {
    inventoryContract?: string
    priceContract?: string
  } | null
  contractDataLoading: boolean
}

interface UseProductDataReturn {
  productData: ProductInfo | null
  loading: boolean
  error: string | null
  refetchProductData: () => Promise<void>
  setProductData: Dispatch<SetStateAction<ProductInfo | null>>
}

export function useProductData({
  productId,
  activeStoreId,
  storeData,
  contractDataLoading,
}: UseProductDataProps): UseProductDataReturn {
  const [productData, setProductData] = useState<ProductInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProductData = async () => {
    if (!productId || !activeStoreId) {
      setLoading(false)
      return
    }

    // Don't fetch while contract data is still loading to prevent race conditions
    if (contractDataLoading) return

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      // Only show loading on initial load
      const isInitialLoad = !productData
      if (isInitialLoad) {
        setLoading(true)
      }

      // Build URL with storeId, inventoryContract, and priceContract parameters
      const params = new URLSearchParams()
      params.set('storeId', activeStoreId)

      if (storeData?.inventoryContract) {
        params.set('inventoryContract', storeData.inventoryContract)
      }
      if (storeData?.priceContract) {
        params.set('priceContract', storeData.priceContract)
      }

      const url = `/api/products/${productId}?${params.toString()}`
      const response = await fetch(url, { signal: abortController.signal })

      if (!response.ok) {
        throw new Error("Failed to fetch product")
      }

      const data = await response.json()

      // Only update state if this request wasn't aborted
      if (!abortController.signal.aborted) {
        setProductData(data.data)
        setError(null)
      }
    } catch (err) {
      // Don't update state for aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      if (!abortController.signal.aborted) {
        console.error("Failed to fetch product:", err)
        setError("Failed to load product")
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }

  const refetchProductData = async () => {
    await fetchProductData()
  }

  useEffect(() => {
    fetchProductData()
    return () => {
      abortControllerRef.current?.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productId,
    activeStoreId,
    storeData?.inventoryContract,
    storeData?.priceContract,
    contractDataLoading,
    // Intentionally not including fetchProductData to avoid infinite loops
    // and productData to avoid refetching when data changes
  ])

  return {
    productData,
    loading,
    error,
    refetchProductData,
    setProductData,
  }
}