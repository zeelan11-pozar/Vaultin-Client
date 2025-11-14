import toast, { ToastOptions } from "react-hot-toast";

// Define allowed types
type ToastType = "info" | "success" | "error" | "warn";

// Shared base styles
const baseStyle: ToastOptions["style"] = {
  padding: "12px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
};

// Map toast type to styles
const toastStyles: Record<ToastType, ToastOptions> = {
  info: {
    style: { ...baseStyle, background: "#E3F2FD", color: "#0D47A1" },
    icon: "ℹ️",
  },
  success: {
    style: { ...baseStyle, background: "#E8F5E9", color: "#1B5E20" },
    icon: "✅",
  },
  error: {
    style: { ...baseStyle, background: "#FFEBEE", color: "#B71C1C" },
    icon: "❌",
  },
  warn: {
    style: { ...baseStyle, background: "#FFF8E1", color: "#FF6F00" },
    icon: "⚠️",
  },
};

// notify function with type-safe defaults
export const notify = (
  message: string,
  type: ToastType = "info"
): string => {
  return toast(message, toastStyles[type]);
};
