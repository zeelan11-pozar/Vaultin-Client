"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Lock, Copy, Trash2, Clock, LinkIcon } from "lucide-react"
import { colors } from "@/lib/colors"
import { typography } from "@/lib/typography"
import Image from "next/image"
import { Button } from "@/components/buttons"
import { useGetMediaByIdQuery } from "@/services/queries/mediaQueries"
import { VideoPlayer, AudioPlayer, DocumentViewer } from "@/components/media-viewers"
import { PostMediaResponse } from "@/types"
import { useDeleteMediaByIdMutation } from "@/services/mutations/mediaMutations"
import { notify } from "@/lib/toast"
import { CustomButton } from "@/components/ui/custom-button"

// MediaViewer component that chooses the right viewer based on type
interface MediaViewerProps {
  media: PostMediaResponse
}

function MediaViewer({ media }: MediaViewerProps) {
  const className = "w-full aspect-video"

  switch (media.type) {
    case 'VIDEO':
      return (
        <VideoPlayer
          src={media.url}
          title={media.title}
          className={className}
        />
      )
    case 'AUDIO':
      return (
        <AudioPlayer
          src={media.url}
          title={media.title}
          className={className}
        />
      )
    case 'DOCUMENT':
      return (
        <DocumentViewer
          src={media.url}
          title={media.title}
          fileName={media.fileName}
          className={className}
        />
      )
    case 'IMAGE':
    default:
      return (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={media.url || "/blurred-sunset-beach-landscape.png"}
            alt={media.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )
  }
}

// Mock data - in real app this would come from API
const getMediaData = (id: string) => ({
  id,
  title: "Sunset Beach Photo",
  type: "image",
  status: "published",
  customLink: `https://vaultin.com/content/sunset-beach-photo`,
  previewImage: "/blurred-sunset-beach-landscape.png",
  linkExpiresIn: 30,
})

export default function MediaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const { data, isLoading, isSuccess, isError } = useGetMediaByIdQuery(params.id as string)
  const deleteMediaMutation = useDeleteMediaByIdMutation()

  const mediaId = params.id as string
  const media = getMediaData(mediaId)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(media.customLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this content? This action cannot be undone.")) {
      // Handle delete logic here
      deleteMediaMutation.mutate(mediaId, {
        onSuccess: () => {
          router.push("/content-library")
        },
        onError: (error: any) => {
          console.error("Failed to delete media:", error)
          notify(error?.response?.data?.message, 'error')
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/content-library" className="hover:text-gray-700">
            Content Library
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className={`text-[${colors.primary}] font-medium`}>Published Content</span>
        </nav>

        {/* Page Title */}
        <h1 className={`${typography.h1} mb-8 font-medium`}>Published Content</h1>

        {/* Media Title */}
        <h2 className={`${typography.h2} text-xl lg:text-2xl mb-6 font-medium`}>{data?.data?.title}</h2>

        {/* Media Preview */}
        <div className="relative mb-8">
          {isLoading ? (
            <div className="aspect-video w-full rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : isError ? (
            <div className="aspect-video w-full rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
              <span className="text-red-500">Error loading media</span>
            </div>
          ) : data?.data ? (
            <MediaViewer media={data.data} />
          ) : (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={media.previewImage || "/placeholder.svg"}
                alt={media.title}
                width={1000}
                height={1000}
                className="w-full h-full object-cover filter blur-sm"
                priority
              />

              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Content Locked</h3>
                  <p className="text-sm opacity-90">Purchase required to view full content</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        {data?.data?.description && (
          <div className="mb-8">
            <h3 className={`${typography.h3} text-lg mb-4`}>Description</h3>
            <div 
              className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.data.description }}
            />
          </div>
        )}

        {/* Custom Link Section */}
        {/* Status Indicator at the start of the section */}
        {data?.data && (
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                ${data.data.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : data.data.status === "PENDING_REVIEW"
                    ? "bg-yellow-100 text-yellow-800"
                    : data.data.status === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : data.data.status === "SUSPENDED"
                        ? "bg-orange-100 text-orange-800"
                        : data.data.status === "DELETED"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {data.data.status.replace(/_/g, " ").toLowerCase().replace(/^\w/, c => c.toUpperCase())}
            </span>
            {data.data.status !== "APPROVED" && (
              <span className="ml-2 text-xs text-gray-500">(This section is disabled until approved)</span>
            )}
          </div>
        )}

        {data?.data && (
          <div
            className={`space-y-6 relative ${data.data.status !== "APPROVED"
              ? "pointer-events-none opacity-50 select-none"
              : ""
              }`}
          >
            <div>
              <h3 className={`${typography.h3} text-lg mb-4`}>Custom Link</h3>

              {/* Link Input and Copy Button */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={media.customLink}
                    readOnly
                    disabled={data.data.status !== "APPROVED"}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm focus:outline-none"
                  />
                </div>
                <Button
                  onClick={handleCopyLink}
                  className="sm:w-auto w-full"
                  disabled={data.data.status !== "APPROVED"}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              <p className="text-gray-600 text-sm mb-4">Share this link with your audience</p>

              {/* Security Notice */}
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      New link will be generated in <span className="font-medium">{media.linkExpiresIn} days</span> for
                      security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Button */}
        <div className="pt-4 border-t border-gray-200">
          <CustomButton
            variant="destructive"
            onClick={handleDelete}
            className="w-full sm:w-auto"
            disabled={deleteMediaMutation.isPending}
            loading={deleteMediaMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
