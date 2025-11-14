import { Check } from "lucide-react"
import { typography } from "@/lib/typography"

const SecurityFeatures = () => {
  const features = [
    "End-to-end encryption for all premium content",
    "Secure payment processing with buyer protection",
    "Content review system ensures platform quality",
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="bg-primary-500 rounded-full p-1">
          <Check className="h-3 w-3 text-white" />
        </div>
        <span className={`${typography.bodySmall} font-medium text-neutral-900`}>
          Your content is secure with Vaultin
        </span>
      </div>
      <ul className="space-y-2 ml-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-neutral-400 mt-1">•</span>
            <span className={`${typography.bodySmall} text-neutral-600`}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { SecurityFeatures }
