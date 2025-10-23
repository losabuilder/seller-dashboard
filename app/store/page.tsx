"use client"

import { useState } from "react"
import { IpfsImage } from "@/components/ui/ipfs-image"
import {
  updateStoreSchema,
  type StoreFieldData,
} from "@/schemas/storeValidation"
import { contentHashToCid } from "@/utils/ipfs"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Edit,
  Globe,
  Loader2,
  Mail,
  Save,
  Store as StoreIcon,
  X,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { StoreAttestations } from "@/types/store"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StoreLogoUpload } from "@/components/store/StoreLogoUpload"
import { TechnicalDetailsCard } from "@/components/store/TechnicalDetailsCard"
import { useStore } from "@/app/contracts/hooks/useStore"
import { useTransactionExecutor } from "@/app/contracts/hooks/useTransactionExecutor"
import type {
  StoreAttestationMetadata,
  StoreUpdateData,
} from "@/app/contracts/services/store-update-service"
import { StoreUpdateService } from "@/app/contracts/services/store-update-service"

export default function StorePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Form setup with validation
  const form = useForm<StoreFieldData>({
    resolver: zodResolver(updateStoreSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      website: "",
      logoContentHash: "",
    },
  })

  const {
    storeData,
    contractDataLoading,
    error,
    refetch,
    smartWalletAddress,
    chainId,
    activeStoreId,
    clearStores,
    updateStoreData,
    removeStore,
  } = useStore()

  const { executeTransaction, isLoading: isExecuting } =
    useTransactionExecutor()

  const handleEdit = () => {
    if (!storeData) return

    form.reset({
      name: storeData.name || "",
      description: storeData.description || "",
      email: storeData.email || "",
      website: storeData.website || "",
      logoContentHash: storeData.logoContentHash || "",
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleDeleteStore = async () => {
    if (!activeStoreId || !chainId) {
      toast.error("No active store to delete")
      return
    }

    setIsDeleting(true)
    try {
      // Create revocation call for the store attestation
      const revokeCall = StoreUpdateService.createStoreDeletionCall(
        chainId,
        activeStoreId as `0x${string}`
      )

      // Execute the revocation transaction
      await executeTransaction([revokeCall])

      // Remove the store from local state
      removeStore(activeStoreId)
      setIsEditing(false)

      toast.success("Store deleted successfully")
    } catch (error) {
      console.error("Failed to delete store:", error)
      toast.error("Failed to delete store")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSave = async () => {
    if (!storeData || !chainId || !activeStoreId) {
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
      console.log("Store data:", storeData)
      console.log("Attestation metadata:", storeData.attestations)
      console.log("Form data:", form.getValues())
      console.log("Updates to apply (only changed fields):", updatesToApply)

      // Check if there are any actual changes
      if (Object.keys(updatesToApply).length === 0) {
        toast.info("No changes detected")
        setIsEditing(false)
        return
      }

      // Create transaction calls for store updates
      const attestationMetadata = mapAttestationMetadata(storeData.attestations ?? {})

      const updateCalls = await StoreUpdateService.createStoreUpdateCalls(
        chainId,
        updatesToApply,
        attestationMetadata,
        activeStoreId
      )

      console.log("Update calls to execute:", updateCalls)

      // Execute the transaction with all the update calls
      if (updateCalls.length === 0) {
        toast.info("No transactions to execute")
        setIsEditing(false)
        return
      }

      toast.info("Executing store updates...")

      const txHash = await executeTransaction(updateCalls)
      if (!txHash) {
        throw new Error(
          "Transaction execution failed - no transaction hash returned"
        )
      }

      toast.success("Store updated successfully!")
      console.log("Transaction hash:", txHash)

      // Manually update the store data for instant feedback
      const formData = form.getValues()
      updateStoreData(activeStoreId, {
        name: formData.name,
        description: formData.description,
        email: formData.email,
        website: formData.website,
        logoContentHash: formData.logoContentHash,
      })

      // hard refetch the store data
      if (refetch) {
        // wait 5 seconds for indexing and refetch
        setTimeout(() => {
          refetch()
        }, 5000)
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Store update error:", error)

      // Show specific error messages
      if (error instanceof Error) {
        if (error.message.includes("Transaction execution failed")) {
          toast.error("Transaction failed to execute. Please try again.")
        } else {
          toast.error(`Failed to update store: ${error.message}`)
        }
      } else {
        toast.error("Failed to update store")
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const getUpdatesToApply = () => {
    if (!storeData) return {}

    const formData = form.getValues()
    const updates: StoreUpdateData = {}

    // Check each field for changes
    if (formData.name !== storeData.name) {
      updates.name = formData.name
    }
    if (formData.description !== storeData.description) {
      updates.description = formData.description
    }
    if (formData.email !== storeData.email) {
      updates.email = formData.email
    }
    if (formData.website !== storeData.website) {
      updates.website = formData.website
    }
    if (formData.logoContentHash !== storeData.logoContentHash) {
      console.log("logoContentHash changed")
      updates.logoContentHash = formData.logoContentHash
    }

    return updates
  }

  // Utility function to map attestation metadata with proper types
  const mapAttestationMetadata = (
    attestations: StoreAttestations
  ): Record<keyof StoreUpdateData, StoreAttestationMetadata | null> => {
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
      email: attestations?.email
        ? {
            uid: attestations.email.uid as `0x${string}`,
            schemaId: attestations.email.schemaId as `0x${string}`,
          }
        : null,
      website: attestations?.website
        ? {
            uid: attestations.website.uid as `0x${string}`,
            schemaId: attestations.website.schemaId as `0x${string}`,
          }
        : null,
      logoContentHash: attestations?.logoContentHash
        ? {
            uid: attestations.logoContentHash.uid as `0x${string}`,
            schemaId: attestations.logoContentHash.schemaId as `0x${string}`,
          }
        : null,
    }
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Error loading store
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!storeData) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <StoreIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h2 className="text-lg font-semibold">No store found</h2>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created a store yet.
          </p>
          <Button asChild>
            <a href="/store/create">Create Store</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-muted-foreground">
            Manage your store settings and information
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                variant="default"
                disabled={isUpdating || isExecuting}
              >
                {isUpdating || isExecuting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isUpdating || isExecuting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Store
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Store Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StoreIcon className="h-5 w-5" />
              Store Information
            </CardTitle>
            <CardDescription>Basic details about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Store Name
              </label>
              {isEditing ? (
                <Input
                  {...form.register("name")}
                  placeholder="Enter store name"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold">
                  {storeData.name || "Not set"}
                </p>
              )}
              {isEditing && form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.name.message}
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
                  placeholder="Enter store description"
                  className="mt-1 resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-sm">
                  {storeData.description || (
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
          </CardContent>
        </Card>

        {/* Contact & Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact & Links
            </CardTitle>
            <CardDescription>How customers can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Email
              </label>
              {isEditing ? (
                <Input
                  {...form.register("email")}
                  placeholder="Enter store email"
                  type="email"
                  className="mt-1"
                />
              ) : storeData.email ? (
                <a
                  href={`mailto:${storeData.email}`}
                  className="flex items-center gap-1 hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {storeData.email}
                </a>
              ) : (
                <p className="text-muted-foreground text-sm">Not provided</p>
              )}
              {isEditing && form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Website
              </label>
              {isEditing ? (
                <Input
                  {...form.register("website")}
                  placeholder="Enter store website"
                  type="url"
                  className="mt-1"
                />
              ) : storeData.website ? (
                <a
                  href={storeData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  {storeData.website}
                </a>
              ) : (
                <p className="text-muted-foreground mt-1 text-sm">
                  Not provided
                </p>
              )}
              {isEditing && form.formState.errors.website && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.website.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Store Logo */}
        <Card>
          <CardHeader>
            <CardTitle>Store Logo</CardTitle>
            <CardDescription>Your store&apos;s visual identity</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <StoreLogoUpload
                form={form}
                currentLogoContentHash={storeData.logoContentHash}
                isEditing={true}
                showCurrentLogo={true}
              />
            ) : storeData.logoContentHash ? (
              <div className="flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                  <IpfsImage
                    useNextImage
                    cid={contentHashToCid(storeData.logoContentHash)}
                    width={128}
                    height={128}
                    fill
                    alt="Store logo"
                    className="h-full w-full object-cover"
                    sizes="128px"
                    priority
                  />
                </div>
              </div>
            ) : (
              <div className="bg-muted flex h-32 items-center justify-center rounded-lg">
                <p className="text-muted-foreground">No logo uploaded</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Details */}
        <TechnicalDetailsCard
          storeData={storeData}
          contractDataLoading={contractDataLoading}
          chainId={chainId}
          smartWalletAddress={smartWalletAddress}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => {
            clearStores()
          }}
          variant="outline"
        >
          <Edit className="mr-2 h-4 w-4" />
          Clear Store Data
        </Button>
        {isEditing && (
          <Button
            onClick={handleDeleteStore}
            variant="destructive"
            disabled={isDeleting}
          >
            <X className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Store"}
          </Button>
        )}
      </div>
    </div>
  )
}
