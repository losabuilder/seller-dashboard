"use client"

import { useState } from "react"
import { getIpfsGatewayUrl } from "@/utils/ipfs"
import { toast } from "sonner"

import type { UploadResult } from "@/app/services/storacha-service"
import { StorachaService } from "@/app/services/storacha-service"

export function useFileUpload() {
  const [files, setFiles] = useState<File[] | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])

  const handleFileChange = async (
    newFiles: File[] | null,
    onSuccess: (result: UploadResult | UploadResult[]) => void
  ) => {
    // If files were removed, update states without uploading
    if (!newFiles?.length) {
      setFiles(null)
      setUploadedUrls([])
      onSuccess({} as UploadResult)
      return
    }

    // Otherwise, this is a new file upload
    setFiles(newFiles)
    setUploading(true)
    try {
      // Upload each file individually to get individual UploadResults
      const uploadedFiles = await Promise.all(
        newFiles.map((file) => StorachaService.uploadFile(file))
      )

      // Generate URLs for each uploaded file using Storacha gateway (using CIDs)
      const urls = uploadedFiles.map((result) => getIpfsGatewayUrl(result.cid))
      setUploadedUrls(urls)

      // Call onSuccess with the appropriate UploadResults
      if (newFiles.length === 1) {
        onSuccess(uploadedFiles[0])
        toast.success("File uploaded successfully to IPFS")
      } else {
        onSuccess(uploadedFiles)
        toast.success(
          `${uploadedFiles.length} files uploaded successfully to IPFS`
        )
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload files to IPFS")
    } finally {
      setUploading(false)
    }
  }

  const clearUpload = () => {
    setFiles(null)
    setUploadedUrls([])
  }

  return {
    files,
    uploading,
    uploadedUrls,
    handleFileChange,
    clearUpload,
  }
}
