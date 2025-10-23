"use client"

import Image from "next/image"
import { StoreFieldData } from "@/schemas/storeValidation"
import { contentHashToCid, getIpfsGatewayUrl } from "@/utils/ipfs"
import { Upload } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { useFileUpload } from "@/hooks/useFileUpload"
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload"
import type { UploadResult } from "@/app/services/storacha-service"

interface StoreLogoUploadProps {
  form: UseFormReturn<StoreFieldData>
  currentLogoContentHash?: string | null
  isEditing?: boolean
  showCurrentLogo?: boolean
}

export function StoreLogoUpload({
  form,
  currentLogoContentHash,
  isEditing = false,
  showCurrentLogo = false,
}: StoreLogoUploadProps) {
  const { files, uploading, uploadedUrls, handleFileChange } = useFileUpload()

  const onFileChange = (newFiles: File[] | null) => {
    handleFileChange(newFiles, (result) => {
      // Since this is a single file upload, result is always UploadResult (not array)
      const uploadResult = result as UploadResult
      // Use contentHash for logoContentHash (EIP-1577 format)
      form.setValue("logoContentHash", uploadResult.contentHash)
    })
  }

  return (
    <div className="space-y-4">
      {/* Show current logo in edit mode */}
      {showCurrentLogo && currentLogoContentHash && (
        <div className="text-center">
          <p className="text-muted-foreground mb-2 text-sm">Current Logo:</p>
          <div className="flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
              <Image
                src={getIpfsGatewayUrl(
                  contentHashToCid(currentLogoContentHash)
                )}
                fill
                alt="Current store logo"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.nextElementSibling?.classList.remove("hidden")
                  target.nextElementSibling?.classList.add("flex")
                }}
              />
              <div className="bg-muted text-muted-foreground absolute inset-0 hidden items-center justify-center">
                Logo not available
              </div>
            </div>
          </div>
        </div>
      )}

      <FileUploader
        value={files}
        onValueChange={onFileChange}
        dropzoneOptions={{
          maxFiles: 1,
          maxSize: 1024 * 1024 * 4,
          multiple: false,
        }}
        className="bg-background relative rounded-lg p-2"
      >
        <FileInput
          id="logoFileInput"
          className="outline-1 outline-slate-500 outline-dashed"
        >
          <div className="flex w-full flex-col items-center justify-center p-4">
            <Upload className="h-6 w-6 text-gray-500" />
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
              &nbsp; or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (max 4MB)
            </p>
            {uploading && (
              <p className="mt-2 text-sm text-blue-500">Uploading...</p>
            )}
          </div>
        </FileInput>
        <FileUploaderContent>
          {files &&
            files.length > 0 &&
            files.map((file, i) => (
              <FileUploaderItem key={i} index={i}>
                <span>{file.name}</span>
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>

      {/* Show uploaded logo preview */}
      {uploadedUrls.length > 0 && (
        <div className="text-center">
          <p className="text-muted-foreground mb-2 text-sm">
            {isEditing ? "New Logo Preview:" : "Logo Preview:"}
          </p>
          <div className="flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
              <Image
                src={uploadedUrls[0]}
                fill
                alt="Logo preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Show update indicator in edit mode */}
      {isEditing &&
        form.watch("logoContentHash") !== currentLogoContentHash && (
          <div className="text-muted-foreground text-center text-sm">
            Logo will be updated
          </div>
        )}
    </div>
  )
}
