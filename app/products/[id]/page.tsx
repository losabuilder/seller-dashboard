"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit, Loader2, Save, ShoppingBag, X } from "lucide-react";

import { contentHashToCid } from "@/utils/ipfs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileInput, FileUploader } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { IpfsImage } from "@/components/ui/ipfs-image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortableImageGrid } from "@/components/ui/sortable-image-grid";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/app/contracts/hooks/useStore";

// Components
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ProductLoadingSkeleton, EmptyState } from "../components/LoadingStates";

// Custom hooks
import { useProductData } from "../hooks/useProductData";
import { useImageUpload } from "../hooks/useImageUpload";
import { useProductEditor } from "../hooks/useProductEditor";
import { useOptimisticUpdates } from "../hooks/useOptimisticUpdates";
import type { ProductUpdateData } from "@/app/contracts/services/product-update-service";
import {
  shippingOptions,
  returnWindowOptions,
  returnPolicyOptions,
  getShippingLabel,
  getReturnWindowLabel,
  getReturnPolicyLabel
} from "../constants/productOptions";

// Product form options imported from shared constants

export default function ProductPage() {
  const params = useParams()
  const productId = params?.id as string
  const { storeData, activeStoreId, contractDataLoading } = useStore()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Custom hooks for data management
  const { productData, loading, error, refetchProductData, setProductData } = useProductData({
    productId,
    activeStoreId,
    storeData,
    contractDataLoading,
  })

  const {
    fileItems,
    uploading,
    uploadedResults,
    files,
    handleFileChange,
    handleImageReorder,
    handleImageDelete,
    setFileItems,
  } = useImageUpload()

  const { applyOptimisticUpdates } = useOptimisticUpdates()

  // Handle optimistic updates with our custom hook
  const handleOptimisticUpdate = (updates: ProductUpdateData) => {
    if (productData) {
      const updatedData = applyOptimisticUpdates(productData, updates)
      setProductData(updatedData) // Apply optimistic update immediately
    }
  }

  const {
    form,
    isEditing,
    isUpdating,
    handleEdit,
    handleCancel,
    handleSaveWithRetry,
  } = useProductEditor({
    productData,
    storeData,
    activeStoreId,
    uploadedResults,
    onOptimisticUpdate: handleOptimisticUpdate,
    onRefetch: refetchProductData,
    setFileItems,
  })

  // Loading state
  if (loading) {
    return <ProductLoadingSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="mt-4 space-x-2">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Product not found state
  if (!productData) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Product not found"
        description="The product you're looking for doesn't exist."
      >
        <Button asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </EmptyState>
    )
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto space-y-6 py-8">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Product Details</h1>
            <p className="text-muted-foreground">
              View and edit your product information
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isEditing ? (
              <>
                <Button
                  onClick={() => handleSaveWithRetry(false)}
                  variant="default"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isUpdating}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Visual representation of your product</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <FileUploader
                  value={files}
                  onValueChange={handleFileChange}
                  dropzoneOptions={{
                    maxFiles: 5,
                    maxSize: 1024 * 1024 * 4, // 4MB
                    multiple: true,
                  }}
                  className="bg-background relative rounded-lg p-2"
                >
                  <FileInput className={`outline-1 outline-slate-500 outline-dashed ${uploading ? 'opacity-50' : ''}`}>
                    <div className="flex w-full flex-col items-center justify-center p-8">
                      {uploading ? (
                        <>
                          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                          <p className="mt-2 text-sm text-blue-500 font-medium">
                            Uploading to IPFS...
                          </p>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-10 w-10 text-gray-500" />
                          <p className="mb-1 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            SVG, PNG, JPG or GIF
                          </p>
                        </>
                      )}
                    </div>
                  </FileInput>
                </FileUploader>

                {/* Sortable image grid for completed uploads only */}
                {fileItems.filter(item => item.uploadStatus === "completed").length > 0 && (
                  <SortableImageGrid
                    images={fileItems
                      .filter((item) => item.uploadStatus === "completed")
                      .map((item) => item.result!)}
                    onReorder={handleImageReorder}
                    onDelete={handleImageDelete}
                  />
                )}
              </div>
            ) : productData.mediaManifest?.ordering?.length ? (
              <div className="space-y-4">
                {/* Hero image */}
                <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-lg">
                  <IpfsImage
                    useNextImage
                    cid={contentHashToCid(productData.mediaManifest.ordering[selectedImageIndex])}
                    fill
                    alt={`Product image ${selectedImageIndex + 1}`}
                    className="object-cover"
                    sizes="300px"
                    priority
                  />
                </div>

                {/* Thumbnail grid */}
                {productData.mediaManifest.ordering.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto justify-center">
                    {productData.mediaManifest.ordering.map((contentHash, index) => (
                      <button
                        key={contentHash}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                          selectedImageIndex === index
                            ? "border-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <IpfsImage
                          useNextImage
                          cid={contentHashToCid(contentHash)}
                          fill
                          alt={`Product thumbnail ${index + 1}`}
                          className="object-cover"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-muted flex h-32 items-center justify-center rounded-lg">
                <p className="text-muted-foreground">No images uploaded</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Product Information
            </CardTitle>
            <CardDescription>Basic details about your product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Product Name
              </label>
              {isEditing ? (
                <Input
                  {...form.register("title")}
                  placeholder="Enter product name"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold">
                  {productData.name || "Not set"}
                </p>
              )}
              {isEditing && form.formState.errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Description
              </label>
              {isEditing ? (
                <Textarea
                  {...form.register("description")}
                  placeholder="Enter product description"
                  className="mt-1 resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-sm">
                  {productData.description || (
                    <span className="text-muted-foreground">
                      No description provided
                    </span>
                  )}
                </p>
              )}
              {isEditing && form.formState.errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Price
                </label>
                {isEditing ? (
                  <Input
                    {...form.register("price", { valueAsNumber: true })}
                    type="number"
                    placeholder="0.00"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-semibold">
                    ${productData.price?.toFixed(2) || "0.00"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-muted-foreground text-sm font-medium">
                  Inventory
                </label>
                {isEditing ? (
                  <Input
                    {...form.register("inventory", { valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-semibold">
                    {productData.inventory || 0} in stock
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Product Policies</CardTitle>
            <CardDescription>Return, shipping, and other policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Return Window
              </label>
              {isEditing ? (
                <Select
                  onValueChange={(value) => form.setValue("return_window", value)}
                  defaultValue={form.getValues("return_window")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {returnWindowOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">
                  {getReturnWindowLabel(productData.returnWindow || "")}
                </p>
              )}
            </div>

            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Return Policy
              </label>
              {isEditing ? (
                <Select
                  onValueChange={(value) => form.setValue("return_policy", value)}
                  defaultValue={form.getValues("return_policy")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {returnPolicyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">
                  {getReturnPolicyLabel(productData.returnPolicy || "")}
                </p>
              )}
            </div>

            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Shipping
              </label>
              {isEditing ? (
                <Select
                  onValueChange={(value) => form.setValue("shipping", value)}
                  defaultValue={form.getValues("shipping")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shippingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm">
                  {getShippingLabel(productData.shipping || "")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Identifiers */}
        <Card>
          <CardHeader>
            <CardTitle>Product Identifiers</CardTitle>
            <CardDescription>SKU, UPC, and other identifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                SKU
              </label>
              {isEditing ? (
                <Input
                  {...form.register("sku")}
                  placeholder="Enter SKU"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm">
                  {productData.sku || (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              )}
            </div>

            <div>
              <label className="text-muted-foreground text-sm font-medium">
                UPC
              </label>
              {isEditing ? (
                <Input
                  {...form.register("upc")}
                  placeholder="Enter UPC"
                  className="mt-1"
                />
              ) : (
                <p className="text-sm">
                  {productData.upc || (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </ErrorBoundary>
  )
}