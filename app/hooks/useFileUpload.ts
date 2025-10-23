import { useState, useCallback } from "react"
import { toast } from "sonner"
import { StorachaService, type UploadResult } from "@/app/services/storacha-service"

// Generic file upload state interface
export interface FileUploadItem {
  file: File
  result?: UploadResult & { uniqueId: string }
  uploadStatus: "pending" | "uploading" | "completed" | "error"
}

export interface UseFileUploadOptions {
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  autoUpload?: boolean
  onUploadStart?: (files: File[]) => void
  onUploadComplete?: (results: (UploadResult & { uniqueId: string })[]) => void
  onUploadError?: (error: Error, file: File) => void
  showToasts?: boolean
}

interface UseFileUploadReturn {
  fileItems: FileUploadItem[]
  uploading: boolean
  uploadedResults: (UploadResult & { uniqueId: string })[]
  files: File[]
  addFiles: (newFiles: File[]) => Promise<void>
  removeFile: (uniqueId: string) => void
  clearAll: () => void
  uploadFiles: (filesToUpload?: File[]) => Promise<void>
  retryUpload: (uniqueId: string) => Promise<void>
  setFileItems: React.Dispatch<React.SetStateAction<FileUploadItem[]>>
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    maxFiles = 10,
    maxSize = 1024 * 1024 * 4, // 4MB default
    acceptedTypes = ['image/*'],
    autoUpload = true,
    onUploadStart,
    onUploadComplete,
    onUploadError,
    showToasts = true,
  } = options

  const [fileItems, setFileItems] = useState<FileUploadItem[]>([])
  const [uploading, setUploading] = useState(false)

  // Derived values
  const uploadedResults = fileItems
    .filter((item) => item.uploadStatus === "completed" && item.result)
    .map((item) => item.result!)

  const files = fileItems.map(item => item.file)

  const validateFile = useCallback((file: File): string | null => {
    // Size validation
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`
    }

    // Type validation
    if (acceptedTypes.length > 0) {
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'))
        }
        return file.type === type
      })
      if (!isValidType) {
        return `File type ${file.type} is not accepted`
      }
    }

    return null
  }, [maxSize, acceptedTypes])

  const uploadSingleFile = useCallback(async (fileItem: FileUploadItem): Promise<UploadResult & { uniqueId: string }> => {
    try {
      const result = await StorachaService.uploadFile(fileItem.file)
      return {
        ...result,
        uniqueId: `${result.cid}-${Date.now()}-${Math.random()}`,
      }
    } catch (error) {
      if (onUploadError) {
        onUploadError(error as Error, fileItem.file)
      }
      throw error
    }
  }, [onUploadError])

  const addFiles = useCallback(async (newFiles: File[]): Promise<void> => {
    // Validate total file count
    const totalFiles = fileItems.length + newFiles.length
    if (totalFiles > maxFiles) {
      const message = `Cannot upload more than ${maxFiles} files`
      if (showToasts) toast.error(message)
      throw new Error(message)
    }

    // Validate each file
    const validationErrors: string[] = []
    newFiles.forEach((file, index) => {
      const error = validateFile(file)
      if (error) {
        validationErrors.push(`File ${index + 1}: ${error}`)
      }
    })

    if (validationErrors.length > 0) {
      const message = validationErrors.join('\n')
      if (showToasts) toast.error(message)
      throw new Error(message)
    }

    // Create pending file items
    const pendingItems: FileUploadItem[] = newFiles.map((file) => ({
      file,
      uploadStatus: "pending" as const,
    }))

    // Add to state
    setFileItems(prev => [...prev, ...pendingItems])

    // Auto-upload if enabled
    if (autoUpload) {
      // Trigger upload after state update
      const uploadNewFiles = async () => {
        // Create the updated fileItems with new pending items
        const updatedFileItems = [...fileItems, ...pendingItems]

        const uploadPromises = newFiles.map(async (file) => {
          const fileItemIndex = updatedFileItems.findIndex(item => item.file === file)
          if (fileItemIndex === -1) return

          // Update to uploading status
          setFileItems(prev => prev.map((item, index) =>
            index === fileItemIndex
              ? { ...item, uploadStatus: "uploading" as const }
              : item
          ))

          try {
            const result = await uploadSingleFile(updatedFileItems[fileItemIndex])

            // Update to completed status
            setFileItems(prev => prev.map((item, index) =>
              index === fileItemIndex
                ? { ...item, result, uploadStatus: "completed" as const }
                : item
            ))

            return result
          } catch (error) {
            // Update to error status
            setFileItems(prev => prev.map((item, index) =>
              index === fileItemIndex
                ? { ...item, uploadStatus: "error" as const }
                : item
            ))
            throw error
          }
        })

        setUploading(true)
        onUploadStart?.(newFiles)

        try {
          const results = await Promise.all(uploadPromises.filter(Boolean))

          if (showToasts && results.length > 0) {
            toast.success(`Successfully uploaded ${results.length} file(s)`)
          }

          onUploadComplete?.(results as (UploadResult & { uniqueId: string })[])
        } catch (error) {
          console.error("Upload error:", error)
          if (showToasts) {
            toast.error("Failed to upload some files")
          }
        } finally {
          setUploading(false)
        }
      }

      uploadNewFiles()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileItems.length, maxFiles, validateFile, autoUpload, showToasts, uploadSingleFile, onUploadStart, onUploadComplete])

  const uploadFiles = useCallback(async (filesToUpload?: File[]): Promise<void> => {
    const targetFiles = filesToUpload || fileItems
      .filter(item => item.uploadStatus === "pending" || item.uploadStatus === "error")
      .map(item => item.file)

    if (targetFiles.length === 0) return

    setUploading(true)
    onUploadStart?.(targetFiles)

    try {
      const uploadPromises = targetFiles.map(async (file) => {
        // Find the corresponding file item
        const fileItemIndex = fileItems.findIndex(item => item.file === file)
        if (fileItemIndex === -1) return

        // Update to uploading status
        setFileItems(prev => prev.map((item, index) =>
          index === fileItemIndex
            ? { ...item, uploadStatus: "uploading" as const }
            : item
        ))

        try {
          const result = await uploadSingleFile(fileItems[fileItemIndex])

          // Update to completed status
          setFileItems(prev => prev.map((item, index) =>
            index === fileItemIndex
              ? { ...item, result, uploadStatus: "completed" as const }
              : item
          ))

          return result
        } catch (error) {
          // Update to error status
          setFileItems(prev => prev.map((item, index) =>
            index === fileItemIndex
              ? { ...item, uploadStatus: "error" as const }
              : item
          ))
          throw error
        }
      })

      const results = await Promise.all(uploadPromises.filter(Boolean))

      if (showToasts && results.length > 0) {
        toast.success(`Successfully uploaded ${results.length} file(s)`)
      }

      onUploadComplete?.(results as (UploadResult & { uniqueId: string })[])
    } catch (error) {
      console.error("Upload error:", error)
      if (showToasts) {
        toast.error("Failed to upload some files")
      }
    } finally {
      setUploading(false)
    }
  }, [fileItems, onUploadStart, onUploadComplete, showToasts, uploadSingleFile])

  const removeFile = useCallback((uniqueId: string) => {
    setFileItems(prev => prev.filter(item =>
      item.result?.uniqueId !== uniqueId &&
      `pending-${item.file.name}` !== uniqueId
    ))
  }, [])

  const clearAll = useCallback(() => {
    setFileItems([])
  }, [])

  const retryUpload = useCallback(async (uniqueId: string) => {
    const fileItem = fileItems.find(item =>
      item.result?.uniqueId === uniqueId || item.uploadStatus === "error"
    )
    if (fileItem) {
      await uploadFiles([fileItem.file])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileItems]) // Intentionally not including uploadFiles to avoid circular dependency

  return {
    fileItems,
    uploading,
    uploadedResults,
    files,
    addFiles,
    removeFile,
    clearAll,
    uploadFiles,
    retryUpload,
    setFileItems,
  }
}