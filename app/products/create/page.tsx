"use client"

import { useEffect, useState } from "react"
import { createProductSchema } from "@/schemas/productValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CloudUpload } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { FileInput, FileUploader } from "@/components/ui/file-upload"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SortableImageGrid } from "@/components/ui/sortable-image-grid"
import { Textarea } from "@/components/ui/textarea"
import CopyableUrl from "@/app/components/CopyableUrl"
import { useProductCreationWorkflow } from "@/app/contracts/workflows/product-creation-workflow"
import type { UploadResult } from "@/app/services/storacha-service"
import { StorachaService } from "@/app/services/storacha-service"
import { useStore } from "@/app/contracts/hooks/useStore"
import { shippingOptions, returnWindowOptions, returnPolicyOptions } from "../constants/productOptions"

const formSchema = createProductSchema

// Product form options imported from shared constants

// Enhanced file data structure to keep files and results in sync
interface FileWithResult {
  file: File
  result: UploadResult & { uniqueId: string }
  uploadStatus: "pending" | "uploading" | "completed" | "error"
}

export default function CreateProduct() {
  const [fileItems, setFileItems] = useState<FileWithResult[]>([])
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { activeStoreId } = useStore()
  const { createProduct, state } = useProductCreationWorkflow()

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4, // 4MB
    multiple: true,
  }

  // Derived values from fileItems for backward compatibility
  const uploadedResults = fileItems
    .filter((item) => item.uploadStatus === "completed")
    .map((item) => item.result)

  const files = fileItems.length > 0 ? fileItems.map((item) => item.file) : null

  // Handle reordering uploaded images
  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    const newFileItems = [...fileItems]
    const [movedItem] = newFileItems.splice(fromIndex, 1)
    newFileItems.splice(toIndex, 0, movedItem)
    setFileItems(newFileItems)
    // Form will be updated via useEffect
  }

  // Handle deleting a specific uploaded image
  const handleImageDelete = (uniqueId: string) => {
    const newFileItems = fileItems.filter(
      (item) => item.result.uniqueId !== uniqueId
    )
    setFileItems(newFileItems)
    // Form will be updated via useEffect
  }

  // Handle file upload when files are dropped/selected
  const handleFileChange = async (newFiles: File[] | null) => {
    // If files were removed, clear everything
    if (!newFiles?.length) {
      setFileItems([])
      // Form will be updated via useEffect
      return
    }

    // If this is a removal of some files (but not all), sync the states
    if (files && files.length > newFiles.length) {
      const newFileItems = fileItems.filter((item) =>
        newFiles.some((newFile) => newFile.name === item.file.name)
      )

      setFileItems(newFileItems)
      // Form will be updated via useEffect
      return
    }

    // Handle new file uploads
    const newFileObjects = newFiles.filter(
      (newFile) => !fileItems.some((item) => item.file.name === newFile.name)
    )

    if (newFileObjects.length === 0) return

    // Create pending file items
    const pendingItems: FileWithResult[] = newFileObjects.map((file) => ({
      file,
      result: {
        cid: "",
        contentHash: "0x" as `0x${string}`,
        uniqueId: `pending-${Date.now()}-${Math.random()}`,
      },
      uploadStatus: "pending" as const,
    }))

    // Add to state immediately
    setFileItems((prev) => [...prev, ...pendingItems])
    setUploading(true)

    try {
      // Upload each file and update its status
      const uploadPromises = newFileObjects.map(async (file, index) => {
        const pendingItem = pendingItems[index]

        // Update to uploading status
        setFileItems((prev) =>
          prev.map((item) =>
            item.result.uniqueId === pendingItem.result.uniqueId
              ? { ...item, uploadStatus: "uploading" as const }
              : item
          )
        )

        try {
          const result = await StorachaService.uploadFile(file)
          const resultWithId = {
            ...result,
            uniqueId: `${result.cid}-${Date.now()}-${Math.random()}`,
          }

          // Update to completed status
          setFileItems((prev) =>
            prev.map((item) =>
              item.result.uniqueId === pendingItem.result.uniqueId
                ? {
                    ...item,
                    result: resultWithId,
                    uploadStatus: "completed" as const,
                  }
                : item
            )
          )

          return resultWithId
        } catch (error) {
          // Update to error status
          setFileItems((prev) =>
            prev.map((item) =>
              item.result.uniqueId === pendingItem.result.uniqueId
                ? { ...item, uploadStatus: "error" as const }
                : item
            )
          )
          throw error
        }
      })

      await Promise.all(uploadPromises)
      // Form will be updated via useEffect when fileItems changes

      toast.success("Files uploaded successfully to IPFS")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload some files to IPFS")
    } finally {
      setUploading(false)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Test Product",
      description: "",
      images: [],
      price: 2,
      inventory: 1,
      sku: "",
      upc: "",
      return_window:
        "0xe3010171122051796f8b1ec20da96986dc779fbbd0d411c426e1ef0d599ee434a121853accdd",
      return_policy:
        "0xe3010171122086e642780ffc2dbeba05807e51e7852a00b322c621c3ef208ab9b3b0167f9ff2",
      shipping:
        "0xe30101711220b084c1990cbc0098c8fd1e45e6f2456949c21d38804785cf2c7a61097be970b1",
    },
  })

  // Ensure form state consistency with fileItems
  useEffect(() => {
    const completedResults = fileItems
      .filter((item) => item.uploadStatus === "completed")
      .map((item) => item.result)

    form.setValue(
      "images",
      completedResults.map((result) => result.contentHash)
    )
  }, [fileItems, form])

  // Cleanup file objects on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up any object URLs that might have been created
      // Note: This is mainly for future use if we start creating object URLs
      // We don't access fileItems here to avoid the dependency warning
      // since this is just a cleanup on unmount
    }
  }, [])

  // Clean up file references when fileItems change to prevent accumulation
  useEffect(() => {
    // This effect doesn't need cleanup since we're managing state properly,
    // but it's good practice to be mindful of file object references
  }, [fileItems])

  /**
   * Submit the form
   * @param values - The form values
   * @dev make all the attestation and set the price and inventory on the respective contracts
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!activeStoreId) {
      toast.error("No active store to create product")
      return
    }

    setIsLoading(true)
    try {
      // Map form values to product creation input
      const productData = {
        storeId: activeStoreId,
        name: values.title,
        description: values.description || "",
        images: values.images || [],
        uploadedResults: uploadedResults,
        price: values.price,
        inventory: values.inventory,
        returnWindow: values.return_window as `0x${string}`,
        returnPolicy: values.return_policy as `0x${string}`,
        shipping: values.shipping as `0x${string}`,
        sku: values.sku || "",
        upc: values.upc || "",
      }

      // Show the data being submitted
      toast.info("Creating product...", {
        description:
          "This may take a few moments as we process multiple blockchain transactions.",
      })

      // Log the data for debugging
      console.log("Product data:", productData)

      await createProduct(productData)

      toast.success("Product created successfully!", {
        description:
          "Copy your Farcaster Frame URL, and paste it into your Farcaster cast.",
      })
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Failed to submit the form. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-8 py-10"
        >
          <h1>Create a Product</h1>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your product name"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Markdown is supported</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <FileUploader
                      value={files}
                      onValueChange={handleFileChange}
                      dropzoneOptions={dropZoneConfig}
                      className="bg-background relative rounded-lg p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-1 outline-slate-500 outline-dashed"
                      >
                        <div className="flex w-full flex-col items-center justify-center p-8">
                          <CloudUpload className="h-10 w-10 text-gray-500" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF
                          </p>
                          {uploading && (
                            <p className="mt-2 text-sm text-blue-500">
                              Uploading...
                            </p>
                          )}
                        </div>
                      </FileInput>
                    </FileUploader>

                    {/* Show uploaded images with drag and drop reordering */}
                    {uploadedResults.length > 0 && (
                      <SortableImageGrid
                        images={uploadedResults}
                        onReorder={handleImageReorder}
                        onDelete={handleImageDelete}
                      />
                    )}

                    {/* Hidden input to store URLs */}
                    <input type="hidden" {...field} />
                  </div>
                </FormControl>
                <FormDescription>
                  Enter up to 10 images. 1X1 ratio is recommended. Please keep
                  under 5MB. Drag images to reorder them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a product price"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>Price is in USD</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter available quantity"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Number of items available for sale
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="return_window"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Window</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a return window" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {returnWindowOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select a return window</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="return_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Policy</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a return policy" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {returnPolicyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select a return policy</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="shipping"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your shipping cost policy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shippingOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select your shipping policy</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product SKU"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional stock keeping unit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="upc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPC</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product UPC"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional universal product code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
      {state.productUId && state.variationUId && (
        <div className="mx-auto mt-4 mb-8 max-w-3xl text-sm">
          <CopyableUrl
            url={`${process.env.NEXT_PUBLIC_FRAMES_URL}/p/${state.productUId}`}
            label="Your Farcaster Frame URL (click to copy)"
          />
        </div>
      )}
    </>
  )
}
