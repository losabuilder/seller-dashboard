"use client"

import { useCallback, useState } from "react"
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets"
import { toast } from "sonner"
import { useChainId } from "wagmi"

import { useStoreCreationWorkflow } from "@/app/contracts/workflows/store-creation-workflow"
import { useStoreStore } from "@/app/stores/store-store"
import { StoreData } from "@/types/store"

export interface CreateStoreInput {
  name: string
  description?: string
  logoContentHash?: `0x${string}` | null
  email?: string
  website?: string
}

export function useStoreCreation() {
  const { client } = useSmartWallets()
  const smartWalletAddress = client?.account.address as `0x${string}`
  const chainId = useChainId()
  const [isCreating, setIsCreating] = useState(false)

  const { addStore, setActiveStore } = useStoreStore()
  const { createStore: createStoreWorkflow, currentStep } =
    useStoreCreationWorkflow()

  const createStore = useCallback(
    async (data: CreateStoreInput) => {
      if (!smartWalletAddress || !chainId) {
        throw new Error("Wallet not connected or chain not supported")
      }

      setIsCreating(true)
      try {
        // Use the existing comprehensive store creation workflow
        const { storeId, orderContract, orderPaidSchema } =
          await createStoreWorkflow(data)

        // Create store data with the actual deployed contract addresses
        const storeData: StoreData = {
          name: data.name,
          description: data.description,
          logoContentHash: data.logoContentHash || null,
          email: data.email,
          website: data.website,
          orderContract,
          orderPaidSchema,
        }

        // Add to Zustand store
        addStore(storeId, storeData)

        // Set as active store
        setActiveStore(storeId)

        toast.success("Store created successfully!")
        return { storeId, orderContract, orderPaidSchema }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create store"
        toast.error(errorMessage)
        throw error
      } finally {
        setIsCreating(false)
      }
    },
    [smartWalletAddress, chainId, createStoreWorkflow, addStore, setActiveStore]
  )

  return {
    createStore,
    isCreating,
    canCreate: !!smartWalletAddress && !!chainId,
    currentStep, // Expose the workflow step for UI feedback
  }
}
