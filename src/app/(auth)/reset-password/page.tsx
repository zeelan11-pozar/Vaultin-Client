"use client"

import type React from "react"

import { useState, Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { InputField } from "@/components/ui/input-field"
import { CustomButton } from "@/components/ui/custom-button"
import { typography } from "@/lib/typography"
import { useResetPasswordMutation } from "@/services/mutations/authMutations"
import { useSearchParams } from "next/navigation"
import { notify } from "@/lib/toast"
import { useRouter } from "next/navigation"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const resetToken = searchParams.get("resetToken")

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const resetPasswordMutation = useResetPasswordMutation()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      notify("Passwords do not match", 'error')
      return
    }
    resetPasswordMutation.mutate({ resetToken: resetToken ?? "", newPassword: newPassword }, {
      onSuccess: () => {
        notify("Password reset successfully", 'success')
        router.push("/login")
      },
      onError: (error: any) => {
        notify(error?.response?.data?.message, 'error')
      }
    })
  }

  return (
    <>
      <div className="text-center lg:text-left mb-8">
        <h2 className={`${typography.h2} text-neutral-900 mb-2`}>Reset Password</h2>
        <p className={`${typography.subtitle} text-neutral-600`}>Create a new secure password for your account</p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-6">
        <InputField
          label="New Password"
          type="password"
          icon="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <InputField
          label="Confirm Password"
          type="password"
          icon="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
          Password must be at least 8 characters and include uppercase, lowercase, number, and special character
        </div>

        <CustomButton type="submit" className="w-full" loading={resetPasswordMutation.isPending} size="lg">
          Reset Password
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
