"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { contentHashToCid } from "@/utils/ipfs"
import { Edit, Plus, ShoppingBag } from "lucide-react"
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets"

import type { ProductListItem } from "@/types/product"
import { useStore } from "@/app/contracts/hooks/useStore"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IpfsImage } from "@/components/ui/ipfs-image"

export default function ProductsPage() {
  const { client } = useSmartWallets()
  const smartWalletAddress = client?.account.address
  const { storeData, activeStoreId, contractDataLoading } = useStore()
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!smartWalletAddress || !activeStoreId) {
      setLoading(false)
      return
    }

    // Don't fetch products while contract data is still loading
    // This prevents race conditions where we fetch without inventory contract first,
    // then fetch again with inventory contract
    if (contractDataLoading) return

    const fetchProducts = async () => {
      try {
        // Only show loading on initial load (when we don't have products yet)
        // For inventory contract changes, do a silent refetch
        const isInitialLoad = products.length === 0
        if (isInitialLoad) {
          setLoading(true)
        }
        setError(null)

        // Build URL with wallet, storeId, inventoryContract, and priceContract parameters
        const params = new URLSearchParams({
          wallet: smartWalletAddress,
          storeId: activeStoreId,
        })
        if (storeData?.inventoryContract) {
          params.set('inventoryContract', storeData.inventoryContract)
        }
        if (storeData?.priceContract) {
          params.set('priceContract', storeData.priceContract)
        }

        const response = await fetch(`/api/products?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setError("Failed to load products")
      } finally {
        // Always reset loading state
        setLoading(false)
      }
    }

    fetchProducts()
  }, [
    smartWalletAddress,
    activeStoreId,
    contractDataLoading,
    storeData?.inventoryContract,
    storeData?.priceContract,
    products.length,
  ])

  if (!activeStoreId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h2 className="text-lg font-semibold">No store selected</h2>
          <p className="text-muted-foreground mb-4">
            Please select a store from the dropdown to view products.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="bg-primary h-4 w-4 animate-pulse rounded-full"></div>
          <p className="text-muted-foreground mt-2">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            {storeData?.name ? `Products for ${storeData.name}` : "Manage your product catalog and inventory"}
          </p>
        </div>
        <Button asChild>
          <Link href="/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h2 className="text-lg font-semibold">No products yet</h2>
            <p className="text-muted-foreground mb-4">
              {storeData?.name
                ? `Start building your catalog for ${storeData.name} by adding your first product.`
                : "Start building your catalog by adding your first product."
              }
            </p>
            <Button asChild>
              <Link href="/products/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Product
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative aspect-square">
                {product.data.mediaManifest?.ordering?.length &&
                 product.data.mediaManifest.items[product.data.mediaManifest.ordering[0]] ? (
                  <IpfsImage
                    useNextImage
                    cid={contentHashToCid(product.data.mediaManifest.ordering[0])}
                    fill
                    alt={product.data.name}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="bg-muted flex h-full items-center justify-center">
                    <ShoppingBag className="text-muted-foreground h-12 w-12" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{product.data.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.data.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    {product.data.price !== undefined && product.data.price !== null && (
                      <p className="text-lg font-semibold">
                        ${product.data.price.toFixed(2)}
                      </p>
                    )}
                    {product.data.inventory !== undefined && (
                      <p className="text-muted-foreground text-sm">
                        {product.data.inventory} in stock
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/products/${product.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
