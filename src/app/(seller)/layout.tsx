"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderOpen, DollarSign, Settings, Lock, Home, Library, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, mobileIcon: Home, mobileLabel: "Home" },
  { name: "Content Library", href: "/content-library", icon: FolderOpen, mobileIcon: Library, mobileLabel: "Library" },
  { name: "Earnings", href: "/earnings", icon: DollarSign, mobileIcon: TrendingUp, mobileLabel: "Earnings" },
  { name: "Settings", href: "/settings", icon: Settings, mobileIcon: Settings, mobileLabel: "Settings" },
]

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Vaultin</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-primary-600 text-white" : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">{children}</main>
      </div>

      {/* Mobile Bottom Navigation - Hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.mobileIcon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  isActive ? "text-primary-600" : "text-gray-500",
                )}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.mobileLabel}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
