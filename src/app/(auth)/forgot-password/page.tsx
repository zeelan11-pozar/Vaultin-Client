"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { InputField } from "@/components/ui/input-field"
import { CustomButton } from "@/components/ui/custom-button"
import { typography } from "@/lib/typography"
import { useRequestResetPasswordOtpMutation } from "@/services/mutations/authMutations"
import { notify } from "@/lib/toast"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const requestResetPasswordOtpMutation = useRequestResetPasswordOtpMutation();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    requestResetPasswordOtpMutation.mutate(email, {
      onSuccess: () => {
        notify("Reset password code sent to your email", 'success')
        router.push("/verify-otp?type=reset&email=" + encodeURIComponent(email));
      },
      onError: (error: any) => {
        notify(error?.response?.data?.message, 'error')
      }
    })
  }

  return (
    <>
      <div className="text-center lg:text-left mb-8">
        <h2 className={`${typography.h2} text-neutral-900 mb-2`}>Forgot Password</h2>
        <p className={`${typography.subtitle} text-neutral-600`}>Enter your email to receive a password reset link</p>
      </div>

      <form onSubmit={handleResetRequest} className="space-y-6">
        <InputField
          label="Email"
          type="email"
          icon="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <CustomButton type="submit" className="w-full" loading={requestResetPasswordOtpMutation.isPending} size="lg">
          Continue
        </CustomButton>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </>
  )
}
