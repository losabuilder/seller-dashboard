"use client"

import {
  createStoreSchema,
  storeFieldSchema,
  type StoreFieldData,
} from "@/schemas/storeValidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { StoreLogoUpload } from "@/components/store/StoreLogoUpload"
import { useStoreCreation } from "@/app/contracts/hooks/useStoreCreation"

export default function CreateStore() {
  const { createStore, isCreating, canCreate, currentStep } = useStoreCreation()

  // Get step description for UI
  const getStepDescription = () => {
    switch (currentStep) {
      case "idle":
        return "Ready to create store"
      case "completed":
        return "Store created successfully!"
      case "error":
        return "Error occurred during creation"
      default:
        return "Processing..."
    }
  }

  const form = useForm<StoreFieldData>({
    resolver: zodResolver(storeFieldSchema),
    defaultValues: {
      name: "",
      description: "",
      logoContentHash: "",
      email: "",
      website: "",
    },
  })

  async function onSubmit(values: StoreFieldData) {
    try {
      if (!canCreate) {
        toast.error("Wallet not connected or chain not supported")
        return
      }

      // Transform the form values using the schema
      const transformedValues = createStoreSchema.parse(values)

      // Show the data being submitted
      toast.info("Creating store...", {
        description: "This may take a few moments.",
      })

      // Log the data for debugging
      console.log("Store data:", transformedValues)

      const { storeId, orderContract, orderPaidSchema } =
        await createStore(transformedValues)
      console.log("Store ID:", storeId)
      console.log("Order Contract:", orderContract)
      console.log("Order Paid Schema:", orderPaidSchema)

      // Redirect to the store page
      window.location.href = "/store"
    } catch (error) {
      console.error("Form submission error", error)
      toast.error("Failed to submit the form. " + error)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-8 py-10"
        >
          <h1>Create a Store</h1>

          {/* Progress Indicator */}
          {isCreating && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 animate-pulse rounded-full"></div>
                <span className="text-muted-foreground text-sm">
                  {getStepDescription()}
                </span>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your store name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a store description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your store (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logoContentHash"
            render={() => (
              <FormItem>
                <FormLabel>Store logo</FormLabel>
                <FormControl>
                  <StoreLogoUpload form={form} />
                </FormControl>
                <FormDescription>
                  Upload your store logo. Please keep under 4MB. (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter store email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Contact email for your store (optional, made publicly
                      available)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter store website"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your store&apos;s website URL (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating Store..." : "Create Store"}
          </Button>
        </form>
      </Form>
    </>
  )
}
