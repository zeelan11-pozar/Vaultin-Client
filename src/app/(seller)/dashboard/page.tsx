"use client"

import { DollarSign, Heart, Upload, Gift } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { ContentCard } from "@/components/content-card"
import { useRouter } from "next/navigation"
import { Button } from "@/components/buttons"

export default function DashboardPage() {
  const router = useRouter()

  const stats = [
    {
      title: "Total Earnings",
      value: "$2,487.50",
      icon: DollarSign,
      iconColor: "text-primary-600",
    },
    {
      title: "Total Likes",
      value: "1,243",
      icon: Heart,
      iconColor: "text-red-500",
      avatar: (
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">S</span>
        </div>
      ),
    },
    {
      title: "Total Media Uploads",
      value: "47 files",
      icon: Upload,
      iconColor: "text-primary-600",
    },
    {
      title: "Recent Tips",
      value: "$127.50",
      icon: Gift,
      iconColor: "text-primary-600",
    },
  ]

  const recentContent = [
    {
      id:1,
      title: "Advanced Photography Tips",
      image: "/photography-camera-equipment.jpg",
      timeAgo: "2 days ago",
    },
    {
      id:2,
      title: "Digital Art Collection Vol. 3",
      image: "/digital-art-colorful-tomatoes.jpeg",
      timeAgo: "4 days ago",
    },
    {
      id:3,
      title: "Music Production Guide",
      image: "/music-production-desert-landscape.jpg",
      timeAgo: "1 week ago",
    },
  ]

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Creator Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={'text-primary-600'}
            // avatar={stat.avatar}
          />
        ))}
      </div>

      {/* Recent Content */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Recent Content</h2>
          <Button className="flex items-center space-x-2 w-full sm:w-fit" onClick={() => router.push("/content-upload")}>
            <Upload className="w-4 h-4" />
            <span>New Upload</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {recentContent.map((content, index) => (
            <ContentCard key={index} title={content.title} image={content.image} timeAgo={content.timeAgo} onPress={() => router.push(`/media/${content.id}`)} />
          ))}
        </div>
      </div>
    </div>
  )
}
