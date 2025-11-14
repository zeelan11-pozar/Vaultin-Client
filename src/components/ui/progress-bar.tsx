"use client"
import { cn } from "@/lib/utils"
import { typography } from "@/lib/typography"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabel?: string
  className?: string
}

export function ProgressBar({ currentStep, totalSteps, stepLabel, className }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className={typography.bodySmall}>
          Step {currentStep} of {totalSteps}
        </span>
        {stepLabel && <span className={typography.bodySmall}>{stepLabel}</span>}
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
