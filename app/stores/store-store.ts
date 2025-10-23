import { create } from "zustand"
import { persist } from "zustand/middleware"
import { produce } from "immer"

import { StoreData } from "@/types/store"

interface StoreState {
  // Active store management
  activeStoreId: string | null

  // Store data caching
  stores: Record<string, StoreData>

  // Errors
  errors: Record<string, string | null>

    // Actions
  setActiveStore: (storeId: string) => void
  setStoreData: (storeId: string, data: StoreData) => void
  updateStoreData: (storeId: string, updates: Partial<StoreData>) => void
  setStoreError: (storeId: string, error: string | null) => void
  
  // Granular loading states
  setEasDataLoading: (storeId: string, loading: boolean) => void
  setContractDataLoading: (storeId: string, loading: boolean) => void

  // Store management
  addStore: (storeId: string, data: StoreData) => void
  removeStore: (storeId: string) => void
  clearStores: () => void

  // Utility functions
  hasStore: (storeId: string) => boolean
  getStoreIds: () => string[]
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      activeStoreId: null,
      stores: {},
      errors: {},

      // Actions
      setActiveStore: (storeId: string) => {
        set({ activeStoreId: storeId })
      },

      setStoreData: (storeId: string, data: StoreData) => {
        set(produce((draft) => {
          draft.stores[storeId] = data
          draft.errors[storeId] = null // Clear any previous errors
        }))
      },

      // Update specific fields without overwriting existing data
      updateStoreData: (storeId: string, updates: Partial<StoreData>) => {
        set(produce((draft) => {
          if (draft.stores[storeId]) {
            Object.assign(draft.stores[storeId], updates)
          }
        }))
      },

      setStoreError: (storeId: string, error: string | null) => {
        set(produce((draft) => {
          draft.errors[storeId] = error
        }))
      },

      setEasDataLoading: (storeId: string, loading: boolean) => {
        set(produce((draft) => {
          if (draft.stores[storeId]) {
            draft.stores[storeId].easDataLoading = loading
          }
        }))
      },

      setContractDataLoading: (storeId: string, loading: boolean) => {
        set(produce((draft) => {
          if (draft.stores[storeId]) {
            draft.stores[storeId].contractDataLoading = loading
          }
        }))
      },

      addStore: (storeId: string, data: StoreData) => {
        set(produce((draft) => {
          draft.stores[storeId] = data
          // Set as active store if it's the first one
          if (!draft.activeStoreId) {
            draft.activeStoreId = storeId
          }
        }))
      },

      removeStore: (storeId: string) => {
        set(produce((draft) => {
          delete draft.stores[storeId]
          delete draft.errors[storeId]

          // If we're removing the active store, switch to another one
          if (draft.activeStoreId === storeId) {
            const remainingStoreIds = Object.keys(draft.stores)
            draft.activeStoreId = remainingStoreIds.length > 0 ? remainingStoreIds[0] : null
          }
        }))
      },

      clearStores: () => {
        set({
          stores: {},
          errors: {},
          activeStoreId: null,
        })
      },

      hasStore: (storeId: string) => {
        return storeId in get().stores
      },

      getStoreIds: () => {
        return Object.keys(get().stores)
      },
    }),
    {
      name: "store-store",
      // Only persist these fields
      partialize: (state) => ({
        activeStoreId: state.activeStoreId,
        stores: state.stores,
      }),
    }
  )
)

// Computed selectors
export const useCurrentStore = () => {
  const { stores, activeStoreId } = useStoreStore()
  return activeStoreId ? stores[activeStoreId] || null : null
}

export const useCurrentStoreError = () => {
  const { errors, activeStoreId } = useStoreStore()
  return activeStoreId ? errors[activeStoreId] || null : null
}

export const useStoreCount = () => {
  const { stores } = useStoreStore()
  return Object.keys(stores).length
}

export const useCurrentStoreEasDataLoading = () => {
  const { stores, activeStoreId } = useStoreStore()
  return activeStoreId ? stores[activeStoreId]?.easDataLoading || false : false
}

export const useCurrentStoreContractDataLoading = () => {
  const { stores, activeStoreId } = useStoreStore()
  return activeStoreId
    ? stores[activeStoreId]?.contractDataLoading || false
    : false
}
