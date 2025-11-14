// Local Button component
interface ButtonProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    variant?: "primary" | "secondary" | "outline" | "destructive"
    size?: "sm" | "md" | "lg"
    disabled?: boolean
}

export function Button({
    children,
    className = "",
    variant = "primary",
    size = "md",
    disabled = false,
    ...props
}: {
    children: React.ReactNode
    className?: string
    variant?: "primary" | "secondary" | "outline" | "destructive"
    size?: "sm" | "md" | "lg"
    onClick?: () => void
    disabled?: boolean
}) {
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    }

    const sizes = {
        sm: "px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm",
        md: "px-3 py-1.5 md:px-4 md:py-2 text-sm",
        lg: "px-4 py-2 md:px-6 md:py-3 text-sm md:text-base",
    }

    return (
        <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} {...props}>
            {children}
        </button>
    )
}