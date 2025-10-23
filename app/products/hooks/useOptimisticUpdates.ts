import type { ProductInfo } from "@/types/product"
import type { ProductUpdateData } from "@/app/contracts/services/product-update-service"

interface UseOptimisticUpdatesReturn {
  applyOptimisticUpdates: (productData: ProductInfo, updates: ProductUpdateData) => ProductInfo
}

export function useOptimisticUpdates(): UseOptimisticUpdatesReturn {
  const applyOptimisticUpdates = (productData: ProductInfo, updates: ProductUpdateData): ProductInfo => {
    // Create optimistically updated product data
    const updatedProductData = { ...productData }

    if (updates.name !== undefined) {
      updatedProductData.name = updates.name
    }
    if (updates.description !== undefined) {
      updatedProductData.description = updates.description
    }
    if (updates.price !== undefined) {
      updatedProductData.price = updates.price
    }
    if (updates.inventory !== undefined) {
      updatedProductData.inventory = updates.inventory
    }
    if (updates.sku !== undefined) {
      updatedProductData.sku = updates.sku
    }
    if (updates.upc !== undefined) {
      updatedProductData.upc = updates.upc
    }
    if (updates.returnWindow !== undefined) {
      updatedProductData.returnWindow = updates.returnWindow
    }
    if (updates.returnPolicy !== undefined) {
      updatedProductData.returnPolicy = updates.returnPolicy
    }
    if (updates.shipping !== undefined) {
      updatedProductData.shipping = updates.shipping
    }

    // Handle image updates
    if (updates.images) {
      const existingManifest = productData.mediaManifest
      const uploadedByHash = new Map(
        (updates.uploadedResults ?? []).map((result) => [result.contentHash as string, result])
      )

      const items = updates.images.reduce((acc, contentHash, index) => {
        const uploaded = uploadedByHash.get(contentHash)
        const previous = existingManifest?.items?.[contentHash]

        acc[contentHash] = {
          role: index === 0 ? "hero" : "detail",
          mime: uploaded?.metadata?.mime ?? previous?.mime ?? "image/jpeg",
          alt: previous?.alt ?? "",
          width: uploaded?.metadata?.width ?? previous?.width,
          height: uploaded?.metadata?.height ?? previous?.height,
        }

        return acc
      }, {} as NonNullable<ProductInfo["mediaManifest"]>["items"])

      updatedProductData.mediaManifest = {
        ordering: updates.images,
        items,
      }
    }

    return updatedProductData
  }

  return {
    applyOptimisticUpdates,
  }
}