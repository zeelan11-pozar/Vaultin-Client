"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Check, Plus } from "lucide-react"
import { colors } from "@/lib/colors"

interface BankAccount {
  id: string
  name: string
  number: string
  isDefault?: boolean
}

interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  availableAmount: number
}

// Local Button component
const Button = ({
  children,
  className = "",
  variant = "default",
  onClick,
  disabled = false,
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "destructive"
  onClick?: () => void
  disabled?: boolean
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default: `bg-${colors.primary} text-white hover:bg-${colors.primary} focus:ring-${colors.primary}`,
    outline: `border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-${colors.primary}`,
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export function WithdrawalModal({ isOpen, onClose, availableAmount }: WithdrawalModalProps) {
  const [step, setStep] = useState<"form" | "success">("form")
  const [amount, setAmount] = useState(availableAmount.toString())
  const [selectedBank, setSelectedBank] = useState("chase-4589")
  const [referenceNumber] = useState(`WD-${Math.random().toString().slice(2, 10)}`)

  const bankAccounts: BankAccount[] = [
    { id: "chase-4589", name: "Chase", number: "••••4589", isDefault: true },
    { id: "boa-7732", name: "Bank of America", number: "••••7732" },
  ]

  const selectedBankAccount = bankAccounts.find((bank) => bank.id === selectedBank)

  const handleWithdraw = () => {
    // Simulate withdrawal process
    setStep("success")
  }

  const handleClose = () => {
    setStep("form")
    setAmount(availableAmount.toString())
    onClose()
  }

  const handleBackToDashboard = () => {
    handleClose()
  }

  if (step === "success") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div
              className={`w-16 h-16 bg-${colors.primary} rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <Check className="w-8 h-8 text-white" />
            </div>

            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">Withdrawal Successful</DialogTitle>
              <p className="text-gray-600 mt-2">Your funds are on the way</p>
            </DialogHeader>

            <div className="space-y-4 text-left mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold">${amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">To</span>
                <span className="font-semibold">
                  {selectedBankAccount?.name} {selectedBankAccount?.number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated arrival</span>
                <span className="font-semibold">1-2 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference</span>
                <span className="font-semibold">{referenceNumber}</span>
              </div>
            </div>

            <Button onClick={handleBackToDashboard} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Withdraw Funds</DialogTitle>
          <p className="text-gray-600">Available: ${availableAmount}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount to withdraw</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={availableAmount}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Maximum: ${availableAmount}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select bank account</label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${bank.isDefault ? `bg-${colors.primary}` : "bg-gray-400"}`}
                      />
                      {bank.name} {bank.number} {bank.isDefault && "(Default)"}
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="add-new">
                  <div className="flex items-center gap-2 text-green-600">
                    <Plus className="w-4 h-4" />
                    Add new bank account
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            className="flex-1"
            disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > availableAmount}
          >
            Withdraw
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
