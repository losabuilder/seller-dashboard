import { useCallback, type Dispatch, type SetStateAction } from "react"
import { useFileUpload } from "@/app/hooks/useFileUpload"
import type { UploadResult } from "@/app/services/storacha-service"

// Legacy interface for backward compatibility
export interface FileWithResult {
  file: File
  result: UploadResult & { uniqueId: string }
  uploadStatus: "pending" | "uploading" | "completed" | "error"
}

// File metadata interface for type safety
export interface FileMetadata {
  mime: string
  alt: string
  width?: number
  height?: number
}

interface UseImageUploadReturn {
  fileItems: FileWithResult[]
  uploading: boolean
  uploadedResults: (UploadResult & { uniqueId: string })[]
  files: File[] | null
  handleFileChange: (newFiles: File[] | null) => Promise<void>
  handleImageReorder: (fromIndex: number, toIndex: number) => void
  handleImageDelete: (uniqueId: string) => void
  setFileItems: Dispatch<SetStateAction<FileWithResult[]>>
}

const buildPendingResult = (file: File): UploadResult & { uniqueId: string } => ({
  cid: "",
  contentHash: "0x" as `0x${string}`,
  uniqueId: `pending-${file.name}-${file.lastModified}`,
  metadata: {
    mime: file.type || "image/jpeg",
    alt: "",
    width: undefined,
    height: undefined,
  } as FileMetadata,
})

export function useImageUpload(): UseImageUploadReturn {
  const {
    fileItems: genericFileItems,
    uploading,
    uploadedResults,
    files: fileArray,
    addFiles,
    clearAll,
    setFileItems: setGenericFileItems,
  } = useFileUpload({
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4, // 4MB
    acceptedTypes: ['image/*'],
    autoUpload: true,
    showToasts: true,
  })

  // Convert generic file items to legacy format for backward compatibility
  const fileItems: FileWithResult[] = genericFileItems.map(item => ({
    file: item.file,
    result: item.result ?? buildPendingResult(item.file),
    uploadStatus: item.uploadStatus,
  }))

  const files = fileArray.length > 0 ? fileArray : null

  // Custom setter for product-specific use cases (e.g., setting existing images in edit mode)
  const setFileItems = useCallback((newFileItemsOrUpdater: SetStateAction<FileWithResult[]>) => {
    if (typeof newFileItemsOrUpdater === 'function') {
      // Handle function updater
      setGenericFileItems(prev => {
        const currentFileItems = prev.map(item => ({
          file: item.file,
          result: item.result ?? buildPendingResult(item.file),
          uploadStatus: item.uploadStatus,
        }))
        const updated = newFileItemsOrUpdater(currentFileItems)
        // Convert back to generic format
        return updated.map(item => ({
          file: item.file,
          result: item.result,
          uploadStatus: item.uploadStatus,
        }))
      })
    } else {
      // Handle direct value - convert FileWithResult[] to FileUploadItem[]
      const genericItems = newFileItemsOrUpdater.map(item => ({
        file: item.file,
        result: item.result,
        uploadStatus: item.uploadStatus,
      }))
      setGenericFileItems(genericItems)
    }
  }, [setGenericFileItems])

  const handleFileChange = useCallback(async (newFiles: File[] | null): Promise<void> => {
    // If files were removed, clear everything
    if (!newFiles?.length) {
      clearAll()
      return
    }

    // If this is a removal of some files (but not all), sync the states
    if (files && files.length > newFiles.length) {
      // Filter existing items to only keep files that are still in newFiles
      const updatedFileItems = fileItems.filter((item) =>
        newFiles.some((newFile) => newFile.name === item.file.name)
      )
      setFileItems(updatedFileItems)
      return
    }

    // Handle new file uploads - filter out files that already exist
    const newFileObjects = newFiles.filter(
      (newFile) => !fileItems.some((item) => item.file.name === newFile.name)
    )

    if (newFileObjects.length === 0) return

    // Use the generic hook to add new files
    try {
      await addFiles(newFileObjects)
    } catch (error) {
      // Error handling is done in the generic hook
      console.error("Image upload error:", error)
    }
  }, [addFiles, clearAll, files, fileItems, setFileItems])

  // Handle reordering uploaded images (product-specific feature)
  const handleImageReorder = useCallback((fromIndex: number, toIndex: number): void => {
    const newFileItems = [...fileItems]
    const [movedItem] = newFileItems.splice(fromIndex, 1)
    newFileItems.splice(toIndex, 0, movedItem)
    setFileItems(newFileItems)
  }, [fileItems, setFileItems])

  // Handle deleting a specific uploaded image (delegates to generic hook)
  const handleImageDelete = useCallback((uniqueId: string): void => {
    setFileItems(prev =>
      prev.filter(item => item.result.uniqueId !== uniqueId)
    )
  }, [setFileItems])

  return {
    fileItems,
    uploading,
    uploadedResults,
    files,
    handleFileChange,
    handleImageReorder,
    handleImageDelete,
    setFileItems,
  }
}