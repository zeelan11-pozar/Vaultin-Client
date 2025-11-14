"use client"

import React, { Suspense } from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, RefreshCw } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"
import { typography } from "@/lib/typography"
import { useSearchParams } from "next/navigation"
import { useResendOtpMutation, useResetPasswordVerifyOtpMutation, useVerifyOtpMutation } from "@/services/mutations/authMutations"
import { notify } from "@/lib/toast"
import { useRouter } from "next/navigation"

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function OTPInput({ value, onChange, disabled = false }: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow single digit
    const digit = inputValue.replace(/\D/g, "").slice(-1)

    const newValue = value.split("")
    newValue[index] = digit
    const updatedValue = newValue.join("").slice(0, 6)

    onChange(updatedValue)

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    onChange(pastedData)

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 3)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="space-y-2">
      <label className={`${typography.label} text-neutral-700`}>Verification Code</label>
      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) {
                inputRefs.current[index] = el;
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className="w-12 h-12 text-center text-lg font-semibold border border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        ))}
      </div>
    </div>
  )
}

function VerifyOTPContent() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  const resendOtpMutation = useResendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const resetPasswordVerifyOtpMutation = useResetPasswordVerifyOtpMutation();

  const params = useSearchParams();
  const type = params.get("type") ?? "signup";
  const email = params.get("email");

  // Timer for resend countdown
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return

    if (type === "signup") {
      verifyOtpMutation.mutate({ email: email ?? "", otpCode: otp }, {
        onSuccess: () => {
          notify("OTP verified successfully", 'success')
          router.push("/signup/1");
        },
        onError: (error: any) => {
          notify(error?.response?.data?.message, 'error')
        }
      })
    } else if (type === "reset") {
      resetPasswordVerifyOtpMutation.mutate({ email: email ?? "", otpCode: otp }, {
        onSuccess: (response: any) => {
          notify("OTP verified successfully", 'success')
          router.push("/reset-password?email=" + encodeURIComponent(email ?? "") + "&resetToken=" + response?.data?.resetToken);
        },
        onError: (error: any) => {
          notify(error?.response?.data?.message, 'error')
        }
      })
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    resendOtpMutation.mutate({ email: email ?? "" }, {
      onSuccess: () => {
        setTimeLeft(60)
        setOtp("")
        setResending(false)
        notify("OTP resent successfully", 'success')
      },
      onError: (error: any) => {
        setResending(false)
        notify(error?.response?.data?.message, 'error')
      }
    })
  }

  return (
    <>
      <div className="text-center lg:text-left mb-8">
        <h2 className={`${typography.h2} text-neutral-900 mb-2`}>Verify Your Account</h2>
        <p className={`${typography.subtitle} text-neutral-600`}>Enter the 6-digit code sent to your email</p>
      </div>

      <div className="bg-neutral-50 rounded-lg p-4 mb-6 flex items-center gap-3">
        <Mail className="h-5 w-5 text-primary-500" />
        <div>
          <p className={`${typography.bodySmall} text-neutral-900 font-medium`}>Code sent to {email}</p>
          <p className={`${typography.bodySmall} text-neutral-600`}>Check your inbox and spam folder</p>
        </div>
      </div>

      <form onSubmit={handleVerifyOTP} className="space-y-6">
        <OTPInput value={otp} onChange={setOtp} disabled={verifyOtpMutation.isPending || resending} />

        <CustomButton type="submit" className="w-full" loading={verifyOtpMutation.isPending || resetPasswordVerifyOtpMutation.isPending} size="lg" disabled={otp.length !== 6}>
          Verify Code
        </CustomButton>
      </form>

      <div className="mt-6 text-center space-y-4">
        <p className={`${typography.bodySmall} text-neutral-600`}>Didn&apos;t receive the code?</p>

        {timeLeft > 0 ? (
          <p className={`${typography.bodySmall} text-neutral-500`}>Resend code in {timeLeft}s</p>
        ) : (
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={handleResendOTP}
            loading={resendOtpMutation.isPending}
            className="text-primary-500 hover:text-primary-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Resend Code
          </CustomButton>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={type === "signup" ? "/signup" : "/login"}
          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {type === "signup" ? "Signup" : "Login"}
        </Link>
      </div>
    </>
  )
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  )
}
