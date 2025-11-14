"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, ImageIcon, Video, Music, X, Upload, File } from "lucide-react"
import { cn } from "@/lib/utils"
import { typography } from "@/lib/typography"
import { Button } from "@/components/buttons"
import { RichTextEditor } from "@/components/input"
import { useGeneratePresignedUrlMutation } from "@/services/mutations/userMutations"
import { notify } from "@/lib/toast"
import { usePostMediaMutation } from "@/services/mutations/mediaMutations"
type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT"

export default function ContentUploadPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<MediaType>("IMAGE")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [content, setContent] = useState("");

  const mediaTypes = [
    { id: "IMAGE" as MediaType, label: "Image", icon: ImageIcon },
    { id: "VIDEO" as MediaType, label: "Video", icon: Video },
    { id: "AUDIO" as MediaType, label: "Audio", icon: Music },
    { id: "DOCUMENT" as MediaType, label: "Document", icon: File },
  ]

  const generatePresignedUrlMutation = useGeneratePresignedUrlMutation();
  const postMediaMutation = usePostMediaMutation();

  const handleFileSelect = (file: File) => {
    // Check file size limit (250MB)
    const maxSize = 250 * 1024 * 1024; // 250MB in bytes
    if (file.size > maxSize) {
      notify('File size exceeds 250MB limit. Please choose a smaller file.', 'error');
      return;
    }
    setSelectedFile(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const handlePublish = async () => {
    if (!selectedFile || !title || !price) return
    setIsUploading(true)
    setUploadProgress(0)

    generatePresignedUrlMutation.mutate({
      contentType: selectedFile.type,
      imageType: "post",
      mediaType: selectedType,
    }, {
      onSuccess: async (data) => {
        console.log(data)
        setUploadProgress(25) // Getting presigned URL complete

        try {
          // Upload file to S3 with progress tracking
          const xhr = new XMLHttpRequest()
          
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 50) + 25 // 25-75%
              setUploadProgress(percentComplete)
            }
          })

          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              setUploadProgress(75) // File upload complete
              
              // Create media record
              postMediaMutation.mutate({
                title,
                description: content,
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                mimeType: selectedFile.type,
                url: data.key,
                // duration: selectedType === "VIDEO" ? selectedFile. : 0,
                type: selectedType,
                price: parseFloat(price),
                currency: "USD",
              }, {
                onSuccess: (data) => {
                  console.log(data)
                  setUploadProgress(100) // Complete
                  setTimeout(() => {
                    router.push("/content-approval")
                    setIsUploading(false)
                    setUploadProgress(0)
                  }, 500)
                },
                onError: (error: any) => {
                  console.log(error)
                  notify(error?.response?.data?.message, 'error')
                  setIsUploading(false)
                  setUploadProgress(0)
                }
              })
            } else {
              throw new Error('Upload failed')
            }
          })

          xhr.addEventListener('error', () => {
            notify('Upload failed. Please try again.', 'error')
            setIsUploading(false)
            setUploadProgress(0)
          })

          xhr.open('PUT', data.url)
          xhr.setRequestHeader('Content-Type', selectedFile.type)
          xhr.send(selectedFile)
        } catch (error) {
          console.error('Upload error:', error)
          notify('Upload failed. Please try again.', 'error')
          setIsUploading(false)
          setUploadProgress(0)
        }
      },
      onError: (error: any) => {
        console.log(error)
        notify(error?.response?.data?.message, 'error')
        setIsUploading(false)
        setUploadProgress(0)
      }
    })
  }

  const handleCancel = () => {
    router.push("/content-library")
  }

  const getFileTypeText = () => {
    switch (selectedType) {
      case "IMAGE":
        return "JPG, PNG, MP4, MP3 files"
      case "VIDEO":
        return "MP4, MOV, AVI files"
      case "AUDIO":
        return "MP3, WAV, FLAC files"
      case "DOCUMENT":
        return "PDF files"
      default:
        return "JPG, PNG, MP4, MP3 files"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile Only */}
      <div className="lg:hidden p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
          <span>Content Library</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary-600 font-medium">New Upload</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {/* Breadcrumb - Desktop Only */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-600 mb-6">
          <span>Content Library</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary-600 font-medium">New Upload</span>
        </div>

        <h1 className={cn(typography.h1, "mb-8")}>Upload New Media</h1>

        <div className="space-y-8">
          {/* Media Type Selection */}
          <div>
            <h2 className={cn(typography.h3, "mb-4")}>Media Type</h2>
            <div className="flex flex-wrap gap-3">
              {mediaTypes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedType(id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                    "hover:border-primary-300 hover:bg-primary-50",
                    selectedType === id
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-neutral-700 border-neutral-200",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <h2 className={cn(typography.h3, "mb-4")}>Media File</h2>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 hover:bg-primary-50/50 transition-all">
              <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <p className={cn(typography.body, "text-neutral-600 mb-2")}>Drag files here or click to browse</p>
              <p className={cn(typography.bodySmall, "text-neutral-400 mb-4")}>
                Support for {getFileTypeText()}. Maximum file size: 250MB
              </p>
              <Button variant="outline" onClick={() => document.getElementById("file-input")?.click()}>
                Select File
              </Button>
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
                accept={selectedType === "IMAGE" ? "image/*" : selectedType === "VIDEO" ? "video/*" : selectedType === "AUDIO" ? "audio/*" : "application/pdf"}
              />
            </div>

            {/* Selected File Display */}
            {selectedFile && (
              <div className="mt-4 p-4 bg-neutral-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border">
                    <ImageIcon className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className={cn(typography.body, "font-medium")}>{selectedFile.name}</p>
                    <p className={cn(typography.bodySmall, "text-neutral-500")}>
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Image/JPEG
                    </p>
                  </div>
                </div>
                <button onClick={removeFile} className="p-1 hover:bg-neutral-200 rounded transition-colors">
                  <X className="h-4 w-4 text-neutral-500" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className={cn(typography.h3, "mb-4")}>Title</h2>
            <input
              type="text"
              placeholder="Enter media title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-neutral-400"
            />
          </div>

          {/* Description */}
          <div>
            <h2 className={cn(typography.h3, "mb-4")}>Description</h2>
            <RichTextEditor onChange={setContent} />
          </div>

          {/* Price */}
          <div>
            <h2 className={cn(typography.h3, "mb-4")}>Price to Unlock</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
              <input
                type="number"
                placeholder="Set your price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-neutral-400"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 sm:flex-none bg-transparent"
              disabled={generatePresignedUrlMutation.isPending || postMediaMutation.isPending || isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={!selectedFile || !title || !price || isUploading}
              className="flex-1 sm:flex-none bg-primary-600 hover:bg-primary-700"
            >
              {!isUploading && <Upload className="h-4 w-4" />}
              {isUploading ? `Uploading... ${uploadProgress}%` : "Publish Media"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
