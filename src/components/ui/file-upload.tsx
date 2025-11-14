"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Camera, FileText, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { typography } from "@/lib/typography"

interface FileUploadProps {
  label: string
  description?: string
  acceptedTypes?: string
  maxSize?: string
  icon?: "camera" | "document"
  className?: string
  onFileSelect?: (file: File) => void
  isUploading?: boolean
  isUploaded?: boolean
}

export function FileUpload({
  label,
  description,
  acceptedTypes = "JPEG, PNG or PDF up to 5MB",
  maxSize,
  icon = "document",
  className,
  onFileSelect,
  isUploading = false,
  isUploaded = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleClick = () => {
    if (!isUploading && !isUploaded) {
      fileInputRef.current?.click()
    }
  }

  const getIcon = () => {
    if (isUploading) return Loader2
    if (isUploaded) return CheckCircle
    return icon === "camera" ? Camera : FileText
  }

  const IconComponent = getIcon()

  return (
    <div className={cn("space-y-2", className)}>
      <label className={typography.label}>{label}</label>
      {description && <p className={typography.bodySmall}>{description}</p>}

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed border-neutral-300 rounded-lg p-8",
          "flex flex-col items-center justify-center transition-all duration-200",
          "min-h-[120px]",
          !isUploading && !isUploaded && "cursor-pointer hover:border-primary-400 hover:bg-primary-50/50",
          isDragOver && "border-primary-500 bg-primary-50",
          selectedFile && "border-primary-500 bg-primary-50",
          isUploading && "border-yellow-300 bg-yellow-50",
          isUploaded && "border-green-300 bg-green-50",
        )}
      >
        <IconComponent 
          className={cn(
            "h-8 w-8 mb-2",
            isUploading && "text-yellow-500 animate-spin",
            isUploaded && "text-green-500",
            !isUploading && !isUploaded && "text-neutral-400"
          )} 
        />
        <p className={cn(typography.bodySmall, "text-center text-neutral-600")}>
          {isUploading && "Uploading..."}
          {isUploaded && !isUploading && "Uploaded successfully"}
          {!isUploading && !isUploaded && (selectedFile ? `Selected: ${selectedFile.name}` : "Click or drag to upload")}
          {icon === "document" && !selectedFile && !isUploading && !isUploaded && " front side of card"}
        </p>
        {acceptedTypes && !selectedFile && !isUploading && !isUploaded && (
          <p className={cn(typography.labelSmall, "text-neutral-400 mt-1")}>{acceptedTypes}</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept={icon === "camera" ? "image/*" : ".jpg,.jpeg,.png,.pdf"}
      />
    </div>
  )
}
