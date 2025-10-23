"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useChainId } from "wagmi"
import { getTransactionReceipt } from "wagmi/actions"
import { toast } from "sonner"

import { createProductSchema, type ProductFieldData } from "@/schemas/productValidation"
import type { ProductInfo, ProductAttestations } from "@/types/product"
import { ProductUpdateService, type ProductUpdateData, type ProductAttestationMetadata } from "@/app/contracts/services/product-update-service"
import { useTransactionExecutor } from "@/app/contracts/hooks/useTransactionExecutor"
import { wagmiConfig } from "@/app/contracts/config/wagmi-config"
import { contentHashToCid } from "@/utils/ipfs"
import type { FileWithResult, FileMetadata } from "./useImageUpload"
import type { UploadResult } from "@/app/services/storacha-service"
import { shippingOptions, returnWindowOptions, returnPolicyOptions } from "../constants/productOptions"

interface UseProductEditorProps {
  productData: ProductInfo | null
  storeData: {
    priceContract?: string
    inventoryContract?: string
  } | null
  activeStoreId: string | null
  uploadedResults: (UploadResult & { uniqueId: string })[]
  onOptimisticUpdate: (updates: ProductUpdateData) => void
  onRefetch: () => Promise<void>
  setFileItems: React.Dispatch<React.SetStateAction<FileWithResult[]>>
}

interface UseProductEditorReturn {
  form: ReturnType<typeof useForm<ProductFieldData>>
  isEditing: boolean
  isUpdating: boolean
  retryCount: number
  handleEdit: () => void
  handleCancel: () => void
  handleSaveWithRetry: (isRetry?: boolean) => Promise<void>
  getUpdatesToApply: () => ProductUpdateData
}

// Product form options imported from shared constants

export function useProductEditor({
  productData,
  storeData,
  activeStoreId,
  uploadedResults,
  onOptimisticUpdate,
  onRefetch,
  setFileItems,
}: UseProductEditorProps): UseProductEditorReturn {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const chainId = useChainId()
  const { executeTransaction } = useTransactionExecutor()

  const form = useForm<ProductFieldData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [],
      price: 0,
      inventory: 0,
      sku: "",
      upc: "",
      return_window: returnWindowOptions[0].value,
      return_policy: returnPolicyOptions[0].value,
      shipping: shippingOptions[0].value,
    },
  })

  const handleEdit = (): void => {
    if (!productData) return

    // Convert media manifest to image array
    const images = productData.mediaManifest?.ordering || []

    form.reset({
      title: productData.name || "",
      description: productData.description || "",
      images,
      price: productData.price || 0,
      inventory: productData.inventory || 0,
      sku: productData.sku || "",
      upc: productData.upc || "",
      return_window: productData.returnWindow || returnWindowOptions[0].value,
      return_policy: productData.returnPolicy || returnPolicyOptions[0].value,
      shipping: productData.shipping || shippingOptions[0].value,
    })

    // Convert existing images to fileItems format for the sortable component
    if (productData.mediaManifest?.ordering) {
      const existingFileItems: FileWithResult[] = productData.mediaManifest.ordering.map((contentHash, index) => {
        const item = productData.mediaManifest?.items[contentHash]
        return {
          file: new File([], `existing-image-${index}.${item?.mime?.split('/')[1] || 'jpg'}`, {
            type: item?.mime || 'image/jpeg'
          }),
          result: {
            cid: contentHashToCid(contentHash),
            contentHash: contentHash as `0x${string}`,
            uniqueId: `existing-${contentHash}-${Date.now()}`,
            metadata: {
              mime: item?.mime || 'image/jpeg',
              alt: item?.alt || "",
              width: item?.width,
              height: item?.height,
            } as FileMetadata
          },
          uploadStatus: "completed" as const,
        }
      })
      setFileItems(existingFileItems)
    }

    setIsEditing(true)
  }

  const handleCancel = (): void => {
    setIsEditing(false)
    setFileItems([])
  }

  const getUpdatesToApply = (): ProductUpdateData => {
    if (!productData) return {}

    const formData = form.getValues()
    const updates: ProductUpdateData = {}

    // Check each field for changes
    if (formData.title !== productData.name) {
      updates.name = formData.title
    }
    if (formData.description !== productData.description) {
      updates.description = formData.description
    }
    if (formData.price !== productData.price) {
      updates.price = formData.price
    }
    if (formData.inventory !== productData.inventory) {
      updates.inventory = formData.inventory
    }
    if (formData.sku !== productData.sku) {
      updates.sku = formData.sku
    }
    if (formData.upc !== productData.upc) {
      updates.upc = formData.upc
    }
    if (formData.return_window !== productData.returnWindow) {
      updates.returnWindow = formData.return_window as `0x${string}`
    }
    if (formData.return_policy !== productData.returnPolicy) {
      updates.returnPolicy = formData.return_policy as `0x${string}`
    }
    if (formData.shipping !== productData.shipping) {
      updates.shipping = formData.shipping as `0x${string}`
    }

    // Check if images have changed (new uploads, reordering, or removal)
    const currentImageOrder = uploadedResults.map(result => result.contentHash)
    const originalImageOrder = productData.mediaManifest?.ordering || []

    // Compare current image order with original
    const imagesChanged = currentImageOrder.length !== originalImageOrder.length ||
      currentImageOrder.some((hash, index) => hash !== originalImageOrder[index])

    if (imagesChanged) {
      updates.images = currentImageOrder
      updates.uploadedResults = uploadedResults
    }

    return updates
  }

  const mapAttestationMetadata = (attestations: ProductAttestations): Record<keyof Omit<ProductUpdateData, 'price' | 'inventory'>, ProductAttestationMetadata | null> => {
    return {
      name: attestations?.name
        ? {
            uid: attestations.name.uid as `0x${string}`,
            schemaId: attestations.name.schemaId as `0x${string}`,
          }
        : null,
      description: attestations?.description
        ? {
            uid: attestations.description.uid as `0x${string}`,
            schemaId: attestations.description.schemaId as `0x${string}`,
          }
        : null,
      images: null, // Images don't have attestations - they're handled via mediaManifest
      mediaManifest: attestations?.mediaManifest
        ? {
            uid: attestations.mediaManifest.uid as `0x${string}`,
            schemaId: attestations.mediaManifest.schemaId as `0x${string}`,
          }
        : null,
      returnWindow: attestations?.returnWindow
        ? {
            uid: attestations.returnWindow.uid as `0x${string}`,
            schemaId: attestations.returnWindow.schemaId as `0x${string}`,
          }
        : null,
      returnPolicy: attestations?.returnPolicy
        ? {
            uid: attestations.returnPolicy.uid as `0x${string}`,
            schemaId: attestations.returnPolicy.schemaId as `0x${string}`,
          }
        : null,
      shipping: attestations?.shipping
        ? {
            uid: attestations.shipping.uid as `0x${string}`,
            schemaId: attestations.shipping.schemaId as `0x${string}`,
          }
        : null,
      sku: attestations?.sku
        ? {
            uid: attestations.sku.uid as `0x${string}`,
            schemaId: attestations.sku.schemaId as `0x${string}`,
          }
        : null,
      upc: attestations?.upc
        ? {
            uid: attestations.upc.uid as `0x${string}`,
            schemaId: attestations.upc.schemaId as `0x${string}`,
          }
        : null,
      uploadedResults: null, // This is handled separately in the update data
    }
  }

  const handleSaveWithRetry = async (isRetry = false): Promise<void> => {
    if (isRetry) {
      setRetryCount(prev => prev + 1)
    } else {
      setRetryCount(0)
    }

    await handleSave()
  }

  const handleSave = async (): Promise<void> => {
    if (!productData || !storeData || !activeStoreId) {
      toast.error("Missing required data for update")
      return
    }

    // Validate the form first
    const isValid = await form.trigger()
    if (!isValid) {
      toast.error("Please fix the validation errors")
      return
    }

    setIsUpdating(true)
    try {
      // Get only the fields that actually changed
      const updatesToApply = getUpdatesToApply()
      console.log("Product data:", productData)
      console.log("Form data:", form.getValues())
      console.log("Updates to apply (only changed fields):", updatesToApply)

      // Check if there are any actual changes
      if (Object.keys(updatesToApply).length === 0) {
        toast.info("No changes detected")
        setIsEditing(false)
        return
      }

      // Validate required data formats
      if (!productData.variationId?.startsWith('0x')) {
        throw new Error('Invalid variation ID format')
      }

      if (storeData.priceContract && !storeData.priceContract.startsWith('0x')) {
        throw new Error('Invalid price contract address format')
      }

      if (storeData.inventoryContract && !storeData.inventoryContract.startsWith('0x')) {
        throw new Error('Invalid inventory contract address format')
      }

      // Create transaction calls for product updates
      const attestationMetadata = mapAttestationMetadata(productData.attestations ?? {})

      const updateCalls = await ProductUpdateService.createProductUpdateCalls(
        chainId,
        updatesToApply,
        attestationMetadata,
        productData.variationId as `0x${string}`,
        storeData.priceContract as `0x${string}`,
        storeData.inventoryContract as `0x${string}`
      )

      console.log("Update calls to execute:", updateCalls)

      // Execute the transaction with all the update calls
      if (updateCalls.length === 0) {
        toast.info("No transactions to execute")
        setIsEditing(false)
        return
      }

      toast.info("Executing product updates...")

      const txHash = await executeTransaction(updateCalls)
      if (!txHash) {
        throw new Error(
          "Transaction execution failed - no transaction hash returned"
        )
      }

      // Verify transaction receipt
      await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      })

      toast.success("Product updated successfully!")
      console.log("Transaction hash:", txHash)

      // Apply optimistic updates immediately
      onOptimisticUpdate(updatesToApply)

      setIsEditing(false)

      // Refresh product data in background to ensure accuracy
      setTimeout(async () => {
        try {
          await onRefetch()
        } catch (error) {
          console.error('Failed to refetch product data:', error)
          // Fallback to page reload if refetch fails
          window.location.reload()
        }
      }, 2000)
    } catch (error) {
      console.error("Product update error:", error)

      // Enhanced error handling with specific recovery options
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()

        if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
          // Network errors - offer retry
          toast.error("Network error occurred", {
            description: "Please check your connection and try again",
            action: {
              label: "Retry",
              onClick: () => handleSaveWithRetry(true)
            }
          })
        } else if (errorMessage.includes("insufficient funds") || errorMessage.includes("gas")) {
          // Gas/funding issues
          toast.error("Transaction failed", {
            description: "Insufficient funds or gas limit exceeded. Please check your wallet balance.",
          })
        } else if (errorMessage.includes("user rejected") || errorMessage.includes("cancelled")) {
          // User cancelled transaction
          toast.error("Transaction cancelled", {
            description: "You cancelled the transaction. Your changes have not been saved.",
          })
        } else if (errorMessage.includes("transaction execution failed")) {
          // Transaction execution issues - offer retry with higher gas
          if (retryCount < 2) {
            toast.error("Transaction failed to execute", {
              description: "This may be due to network congestion. Would you like to retry?",
              action: {
                label: `Retry (${retryCount + 1}/2)`,
                onClick: () => handleSaveWithRetry(true)
              }
            })
          } else {
            toast.error("Transaction failed after multiple attempts", {
              description: "Please try again later or contact support if the issue persists.",
            })
          }
        } else if (errorMessage.includes("validation") || errorMessage.includes("invalid")) {
          // Validation errors
          toast.error("Invalid data", {
            description: "Please check your input and try again.",
          })
        } else {
          // Generic error with option to retry once
          if (retryCount === 0) {
            toast.error("Update failed", {
              description: error.message,
              action: {
                label: "Retry",
                onClick: () => handleSaveWithRetry(true)
              }
            })
          } else {
            toast.error("Update failed", {
              description: error.message,
            })
          }
        }
      } else {
        toast.error("An unexpected error occurred", {
          description: "Please try again later.",
        })
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    form,
    isEditing,
    isUpdating,
    retryCount,
    handleEdit,
    handleCancel,
    handleSaveWithRetry,
    getUpdatesToApply,
  }
}