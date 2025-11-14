"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, Upload } from "lucide-react"
import { Button } from "@/components/buttons"
import { MediaCard } from "@/components/media-card"
import { useRouter } from "next/navigation"
import { useGetMediaQuery } from "@/services/queries/mediaQueries"
import Loading from "../loading"

const filterTabs = [
  { id: "all", label: "All", count: 32 },
  { id: "images", label: "Images", count: 18 },
  { id: "videos", label: "Videos", count: 8 },
  { id: "audio", label: "Audio", count: 4 },
  { id: "documents", label: "Documents", count: 2 },
]

export default function ContentLibraryPage() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const { data, isLoading, isSuccess, isError } = useGetMediaQuery()

  // Filter media based on activeFilter and searchQuery
  const filteredMedia = data?.data?.contentFiles?.filter((item) => {
    // Filter by type
    const typeMatch = activeFilter === "all" || 
      (activeFilter === "images" && item.type === "IMAGE") ||
      (activeFilter === "videos" && item.type === "VIDEO") ||
      (activeFilter === "audio" && item.type === "AUDIO") ||
      (activeFilter === "documents" && item.type === "DOCUMENT")

    // Filter by search query
    const searchMatch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

    return typeMatch && searchMatch
  }) || []

  // Calculate actual counts for filter tabs
  const getFilterCount = (filterType: string) => {
    if (!data?.data?.contentFiles) return 0
    
    switch (filterType) {
      case "all":
        return data.data.contentFiles.length
      case "images":
        return data.data.contentFiles.filter(item => item.type === "IMAGE").length
      case "videos":
        return data.data.contentFiles.filter(item => item.type === "VIDEO").length
      case "audio":
        return data.data.contentFiles.filter(item => item.type === "AUDIO").length
      case "documents":
        return data.data.contentFiles.filter(item => item.type === "DOCUMENT").length
      default:
        return 0
    }
  }

  // Update filter tabs with actual counts
  const filterTabsWithCounts = filterTabs.map(tab => ({
    ...tab,
    count: getFilterCount(tab.id)
  }))

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Media Library</h1>
        <Button className="flex items-center space-x-2 w-full sm:w-fit" onClick={() => router.push("/content-upload")}>
          <Upload className="w-4 h-4" />
          <span>New Upload</span>
        </Button>
      </div>

      {
        isLoading && <Loading />
      }

      {
        isError && (
          <div className="flex justify-center items-center py-16">
            <span className="text-red-500 text-lg font-medium">Error</span>
          </div>
        )
      }

      {
        isSuccess && data?.data?.contentFiles?.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <span className="text-gray-500 text-lg">No media found</span>
          </div>
        )
      }

      {
        isSuccess && data?.data?.contentFiles?.length > 0 &&
        <>
          <div className="flex flex-wrap gap-1 md:gap-2 border-b border-gray-200 overflow-x-auto pb-2">
            {filterTabsWithCounts.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeFilter === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                <span>{tab.label}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 md:px-2 py-0.5 rounded-full">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm md:text-base"
              />
            </div>

            {/* <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Filter className="w-4 h-4" />
                <span>Status</span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <span>Sort: Recent</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div> */}
          </div>

          {/* Media Grid */}
          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {filteredMedia.map((item, index) => (
                <MediaCard key={index} {...item} onPress={() => router.push(`/media/${item.id}`)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
              <p className="text-gray-500 max-w-md">
                {searchQuery 
                  ? `No media matches your search "${searchQuery}" in the ${activeFilter === "all" ? "library" : activeFilter + " category"}.`
                  : `No ${activeFilter === "all" ? "media" : activeFilter} found in your library.`
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 md:pt-6">
            <p className="text-xs md:text-sm text-gray-700">Showing 1-9 of 32 items</p>

            <div className="flex items-center justify-center sm:justify-end space-x-1 md:space-x-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div> */}
        </>
      }
    </div>
  )
}
