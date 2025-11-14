"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { User } from "lucide-react"
import { InputField } from "@/components/ui/input-field"
import { CustomButton } from "@/components/ui/custom-button"
import { typography } from "@/lib/typography"
import { useSignUpMutation } from "@/services/mutations/authMutations"
import { notify } from "@/lib/toast"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const signupMutation = useSignUpMutation();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    signupMutation.mutate({
      firstName,
      lastName,
      email,
      password,
      role: "SELLER",
    }, {
      onSuccess: () => {
        // notify("Signup successful")
        router.replace("/verify-otp?type=signup&email=" + encodeURIComponent(email));
      },
      onError: (error: any) => {
        notify(error?.response?.data?.message, 'error')
      }
    })
    setLoading(false)
  }

  return (
    <>
      <div className="text-center lg:text-left mb-8">
        <h2 className={`${typography.h2} text-neutral-900 mb-2`}>Welcome to Vaultin</h2>
        <p className={`${typography.subtitle} text-neutral-600`}>Create your account</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        <InputField
          label="First Name"
          type="text"
          icon={<User className="h-4 w-4 text-neutral-400" />}
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <InputField
          label="Last Name"
          type="text"
          icon={<User className="h-4 w-4 text-neutral-400" />}
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <InputField
          label="Email"
          type="email"
          icon="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:ring-blue-500 focus:border-blue-500"
          required
        />

        <InputField
          label="Password"
          type="password"
          icon="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <InputField
          label="Confirm Password"
          type="password"
          icon="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
            required
          />
          <label htmlFor="terms" className={`${typography.bodySmall} text-neutral-600`}>
            I agree to the{" "}
            <Link href="#" className="text-primary-500 hover:text-primary-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary-500 hover:text-primary-600">
              Privacy Policy
            </Link>
          </label>
        </div>

        <CustomButton type="submit" className="w-full" loading={signupMutation.isPending} disabled={signupMutation.isPending} size="lg">
          Sign Up
        </CustomButton>
      </form>

      <div className="mt-6 text-center">
        <p className={`${typography.bodySmall} text-neutral-600`}>
          Already have an account?{" "}
          <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </>
  )
}
