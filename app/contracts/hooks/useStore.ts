"use client"

import { useCallback, useEffect } from "react"
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets"
import { Address } from "viem"
import { useChainId } from "wagmi"

import type { StoreListItem } from "@/types/store"
import {
  useCurrentStore,
  useCurrentStoreContractDataLoading,
  useCurrentStoreEasDataLoading,
  useCurrentStoreError,
  useStoreStore,
} from "@/app/stores/store-store"

export function useStore() {
  const { client } = useSmartWallets()
  const smartWalletAddress = client?.account.address as `0x${string}`
  const chainId = useChainId()

  // Get store data from Zustand store
  const storeData = useCurrentStore()
  const error = useCurrentStoreError()

  // Combined loading state (either EAS or contract data is loading)
  const easDataLoading = useCurrentStoreEasDataLoading()
  const contractDataLoading = useCurrentStoreContractDataLoading()

  // Get actions from Zustand store
  const {
    activeStoreId,
    setStoreData,
    updateStoreData,
    setStoreError,
    setEasDataLoading,
    setContractDataLoading,
    addStore,
    hasStore,
    clearStores,
    removeStore,
  } = useStoreStore()

  const fetchContractData = useCallback(
    async (storeId: string, orderContract: Address) => {
      try {
        setContractDataLoading(storeId, true)

        // Call our API to fetch contract data
        const response = await fetch(`/api/contracts/order/${orderContract}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch contract data: ${response.status}`)
        }

        const contractResponse = await response.json()
        const contractData = contractResponse.data

        // Update store with contract data
        updateStoreData(storeId, {
          orderPaidSchema: contractData.orderPaidSchema,
          refundSchema: contractData.refundSchema,
          priceContract: contractData.priceContract,
          inventoryContract: contractData.inventoryContract,
          plugins: contractData.plugins,
        })
      } catch (err) {
        console.error("Failed to fetch contract data:", err)
      } finally {
        setContractDataLoading(storeId, false)
      }
    },
    [setContractDataLoading, updateStoreData]
  )

  const fetchStoreData = useCallback(
    async (storeId?: string) => {
      if (!smartWalletAddress || !chainId) return

      const targetStoreId = storeId || activeStoreId
      if (!targetStoreId) return

      try {
        setEasDataLoading(targetStoreId, true)
        setStoreError(targetStoreId, null)

        // Fetch EAS data from our API
        const response = await fetch(`/api/stores/${targetStoreId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch store: ${response.status}`)
        }

        const storeResponse = await response.json()
        const easData = storeResponse.data

        // Set EAS data first
        setStoreData(targetStoreId, easData)

        // If we have orderContract, fetch contract data
        if (easData.orderContract) {
          await fetchContractData(targetStoreId, easData.orderContract)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch store data"
        setStoreError(targetStoreId, errorMessage)
      } finally {
        setEasDataLoading(targetStoreId, false)
      }
    },
    [
      smartWalletAddress,
      chainId,
      activeStoreId,
      setStoreData,
      setStoreError,
      setEasDataLoading,
      fetchContractData,
    ]
  )

  // Search for existing stores when wallet connects
  useEffect(() => {
    if (!smartWalletAddress || !chainId) return

    const searchExistingStores = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch(`/api/stores?wallet=${smartWalletAddress}`)
        if (!response.ok) {
          console.warn("Failed to fetch existing stores:", response.status)
          return
        }

        const existingStores = await response.json()

        // Add any found stores to Zustand
        existingStores.forEach((store: StoreListItem) => {
          if (!hasStore(store.id)) {
            addStore(store.id, store.data)
          }
        })
      } catch (error) {
        console.error("Failed to search existing stores:", error)
      }
    }

    searchExistingStores()
  }, [smartWalletAddress, chainId, hasStore, addStore])

  // Fetch store data when dependencies change
  useEffect(() => {
    if (activeStoreId) {
      fetchStoreData(activeStoreId)
    }
  }, [activeStoreId, fetchStoreData])

  const refetch = useCallback(() => {
    if (activeStoreId) {
      fetchStoreData(activeStoreId)
    }
  }, [activeStoreId, fetchStoreData])

  return {
    storeData,
    easDataLoading,
    contractDataLoading,
    error,
    refetch,
    smartWalletAddress,
    chainId,
    activeStoreId,
    fetchStoreData,
    fetchContractData,
    updateStoreData,
    clearStores,
    removeStore,
  }
}
