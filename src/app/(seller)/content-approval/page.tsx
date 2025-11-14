"use client"
import { useRouter } from "next/navigation"
import { ChevronRight, Check, Clock, CheckCircle, FileText, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { typography } from "@/lib/typography"
import { Button } from "@/components/buttons/Button"

export default function ContentApprovalPage() {
  const router = useRouter()

  const progressSteps = [
    { id: "submitted", label: "Submitted", icon: Check, completed: true },
    { id: "review", label: "Under Review", icon: Clock, completed: false, current: true },
    { id: "approved", label: "Approved", icon: CheckCircle, completed: false },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile Only */}
      <div className="lg:hidden p-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
          <span>Content Library</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary-600 font-medium">Media Approval</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 lg:p-8">
        {/* Breadcrumb - Desktop Only */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-neutral-600 mb-6">
          <span>Content Library</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary-600 font-medium">Media Approval</span>
        </div>

        <div className="text-center max-w-2xl mx-auto px-2">
          {/* Success Icon */}
          <div className="mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-600 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className={cn("text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight", "mb-3 md:mb-4")}>Media Pending Approval</h1>
          <p className={cn("text-base leading-relaxed", "text-neutral-600 mb-8 md:mb-12 px-2")}>
            Your media has been submitted and is awaiting review by our moderation team. Once approved, you&apos;ll be able
            to share it with your community.
          </p>

          {/* Progress Steps */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-8 mb-6 md:mb-8 px-2">
              {progressSteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2",
                          step.completed
                            ? "bg-primary-600 text-white"
                            : step.current
                              ? "bg-primary-100 text-primary-600 border-2 border-primary-600"
                              : "bg-neutral-100 text-neutral-400",
                        )}
                      >
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <span
                        className={cn(
                          "text-xs md:text-sm leading-relaxed",
                          step.completed || step.current ? "text-primary-600 font-medium" : "text-neutral-400",
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < progressSteps.length - 1 && (
                      <div
                        className={cn("w-8 md:w-16 lg:w-24 h-0.5 mx-2 md:mx-4", step.completed ? "bg-primary-600" : "bg-neutral-200")}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* File Details */}
          <div className="bg-neutral-50 rounded-lg p-4 md:p-6 mb-6 md:mb-8 text-left mx-2">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-3 bg-white rounded-lg border flex-shrink-0">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-neutral-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn("text-lg md:text-xl font-semibold", "mb-1 truncate")}>sunset_beach_photo.jpg</h3>
                <p className={cn("text-sm leading-relaxed", "text-neutral-500 mb-2 md:mb-3")}>4.2 MB • Image/JPEG</p>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="text-xs md:text-sm leading-relaxed">Estimated review time: 24-48 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Go Back Button */}
          <div className="mb-6 md:mb-8">
            <Button
              variant="primary"
              size="md"
              onClick={() => router.push("/content-library")}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Email Notification */}
          <p className={cn("text-base leading-relaxed", "text-neutral-600 mb-8 md:mb-12 px-2")}>
            You will receive an email notification when your media is approved
          </p>
        </div>
      </div>
    </div>
  )
}
