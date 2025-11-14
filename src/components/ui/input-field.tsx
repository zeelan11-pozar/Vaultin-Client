"use client"

import React from "react"

import { forwardRef, useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { cn } from "../../lib/utils"
import { typography } from "@/lib/typography"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: "email" | "password" | React.ReactNode
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type

    const getIcon = () => {
      if (icon === "email") return <Mail className="h-4 w-4 text-neutral-400" />
      if (icon === "password") return <Lock className="h-4 w-4 text-neutral-400" />
      if (React.isValidElement(icon)) return icon
      return null
    }

    return (
      <div className="space-y-2">
        <label className={typography.label}>{label}</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">{getIcon()}</div>
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              "placeholder:text-neutral-400 transition-all duration-200",
              "bg-white text-neutral-900",
              isPassword && "pr-12",
              error && "border-error focus:ring-error",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    )
  },
)

InputField.displayName = "InputField"

export { InputField }
