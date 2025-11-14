"use client"
import type React from "react"
import { Lock } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CustomButton } from "@/components/ui/custom-button"
import { ContentPreviewGrid } from "@/components/content-preview-grid"
import { typography } from "@/lib/typography"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 bg-white border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="bg-primary-500 rounded-lg p-2">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <span className={`${typography.h4} text-neutral-900`}>Vaultin</span>
        </div>
        <Link href={isLoginPage ? "/signup" : "/login"}>
          <CustomButton variant="outline" size="sm">
            {isLoginPage ? "Sign Up" : "Log In"}
          </CustomButton>
        </Link>
      </header>

      {/* Main Content */}
      <div className="lg:grid lg:grid-cols-2 lg:min-h-[calc(100vh-80px)]">
        {/* Left Panel - Hero Section */}
        <div className="bg-primary-500 px-6 py-12 md:px-12 lg:px-16 lg:py-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:max-w-none text-center lg:text-left">
            <h1 className={`${typography.h1} text-white mb-4`}>Monetize Your Premium Content</h1>
            <p className={`${typography.subtitleLight} text-primary-100 mb-8`}>
              Secure sharing for creators, easy access for fans
            </p>
            <ContentPreviewGrid />
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="px-6 py-12 md:px-12 lg:px-16 lg:py-20 flex flex-col justify-center">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-50 px-6 py-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className={`${typography.bodySmall} text-neutral-500`}>© 2024 Vaultin. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="#"
                className={`${typography.bodySmall} text-neutral-500 hover:text-neutral-700 transition-colors`}
              >
                Terms of Service
              </a>
              <a
                href="#"
                className={`${typography.bodySmall} text-neutral-500 hover:text-neutral-700 transition-colors`}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className={`${typography.bodySmall} text-neutral-500 hover:text-neutral-700 transition-colors`}
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
