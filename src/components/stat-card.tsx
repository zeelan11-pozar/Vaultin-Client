import { cn } from "@/lib/utils"
import type React from "react"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  iconColor?: string
  avatar?: React.ReactNode
}

export function StatCard({ title, value, icon: Icon, iconColor = "text-primary-600", avatar }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="flex items-center space-x-2">
          {avatar && avatar}
          <div className={cn("p-2 rounded-full bg-gray-50", iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  )
}
