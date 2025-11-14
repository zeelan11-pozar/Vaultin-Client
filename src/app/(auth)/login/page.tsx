"use client"

import type React from "react"

import { useState } from "react"
import { InputField } from "@/components/ui/input-field"
import { CustomButton } from "@/components/ui/custom-button"
import { SecurityFeatures } from "@/components/security-features"
import { typography } from "@/lib/typography"
import { useLoginMutation } from "@/services/mutations/authMutations"
import { notify } from "@/lib/toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { setAccessToken } from "@/services/apis"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const loginMutation = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    loginMutation.mutate({ email, password }, {
      onSuccess: async (data: any) => {
        // notify("Login successful", 'success')
        router.push("/dashboard")
      },
      onError: (error: any) => {
        // notify(error?.response?.data?.message, 'error')
        if (error?.response?.data?.message.startsWith("ACCOUNT_NOT_ACTIVE")) {
          router.push("/signup/2")
        } else if (error?.response?.data?.message.startsWith("AADHAR_CARD_NOT_UPLOADED")) {
          // message format: "AADHAR_CARD_NOT_UPLOADED - accessToken"
          const message = error?.response?.data?.message;
          const token = message?.split(" - ")[1];
          console.log(token)
          if (token) {
            setAccessToken(token)
            router.push(`/signup/1`);
          }
        } else if (error?.response?.data?.message.startsWith("EMAIL_NOT_VERIFIED")) {
          router.push("/verify-otp?type=signup&email=" + encodeURIComponent(email));
        } else {
          notify(error?.response?.data?.message, 'error')
        }
      }
    })
  }

  return (
    <div className="max-w-md mx-auto lg:max-w-sm">
      <div className="text-center lg:text-left mb-8">
        <h2 className={`${typography.h2} text-neutral-900 mb-2`}>Welcome to Vaultin</h2>
        <p className={`${typography.subtitle} text-neutral-600`}>Log in to your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <InputField
          label="Email"
          type="email"
          icon="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputField
          label="Password"
          type="password"
          icon="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className={`${typography.linkSmall}`}
          >
            Forgot password?
          </Link>
        </div>

        <CustomButton type="submit" className="w-full" loading={loginMutation.isPending} size="lg">
          Login
        </CustomButton>
      </form>

      <div className="mt-8">
        <SecurityFeatures />
      </div>
    </div>
  )
}
