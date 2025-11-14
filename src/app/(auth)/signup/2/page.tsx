"use client"
import { Check, Mail, Clock } from "lucide-react"
import { ProgressBar } from "@/components/ui/progress-bar"
import { typography } from "@/lib/typography"

export default function VerificationPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <ProgressBar currentStep={2} totalSteps={2} stepLabel="Verification" />

      <div className="text-center space-y-4">
        <h1 className={typography.h3}>Verification In Progress</h1>
        <p className={typography.subtitle}>We&apos;re reviewing your documents</p>

        <div className="flex justify-center my-8">
          <div className="relative">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className={typography.h4}>Your documents are being verified</h2>
          <p className={typography.body}>
            Our team is reviewing your submitted documents. This process typically takes 24-48 hours.
          </p>

          <div className="flex items-center justify-center gap-2 text-neutral-600">
            <Mail className="h-4 w-4" />
            <p className={typography.bodySmall}>
              You&apos;ll receive an email once your verification is complete.
            </p>
          </div>
        </div>

        <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-500" />
            <span className={typography.label}>What happens next?</span>
          </div>

          <ul className="space-y-3 ml-7">
            <li className={typography.bodySmall}>• Once verified, you&apos;ll get full access to your creator dashboard</li>
            <li className={typography.bodySmall}>• You can start uploading and monetizing your premium content</li>
            <li className={typography.bodySmall}>• Set up payment methods to receive earnings from your content</li>
          </ul>
        </div>
      </div>

      <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className={typography.label}>Your data is protected</span>
        </div>
        <div className="space-y-1 ml-7">
          <p className={typography.bodySmall}>• End-to-end encryption for all document transfers</p>
          <p className={typography.bodySmall}>• Compliant with privacy regulations</p>
          <p className={typography.bodySmall}>• Automatic deletion of sensitive data after verification</p>
        </div>
      </div>
    </div>
  )
}
