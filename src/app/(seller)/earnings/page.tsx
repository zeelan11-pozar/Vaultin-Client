"use client"

import type React from "react"

import { useState } from "react"
import { StatCard } from "@/components/stat-card"
import { DollarSign, TrendingUp, Wallet, Clock, Search, X, Check, ChevronDown, Plus } from "lucide-react"
import { colors } from "@/lib/colors"
import { typography } from "@/lib/typography"
import Image from "next/image"
import { Button } from "@/components/buttons"

interface Transaction {
    id: string
    supporterEmail: string
    amount: number
    postTitle: string
    postImage: string
    date: string
}

interface BankAccount {
    id: string
    name: string
    accountNumber: string
    isDefault?: boolean
    isDisabled?: boolean
}

// Reusable Modal Component
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
}

function Modal({ isOpen, onClose, children, title }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                {title && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}

// Withdrawal Modal Content
interface WithdrawalModalProps {
    availableAmount: number
    onSuccess: (amount: number, bankAccount: BankAccount) => void
    onCancel: () => void
}

function WithdrawalModalContent({ availableAmount, onSuccess, onCancel }: WithdrawalModalProps) {
    const [amount, setAmount] = useState("")
    const [selectedBankId, setSelectedBankId] = useState("chase-4589")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const bankAccounts: BankAccount[] = [
        { id: "chase-4589", name: "Chase", accountNumber: "••••4589", isDefault: true },
        { id: "chase-4589-2", name: "Chase", accountNumber: "••••4589", isDefault: true },
        { id: "boa-7732", name: "Bank of America", accountNumber: "••••7732", isDisabled: true }
    ]

    const selectedBank = bankAccounts.find(bank => bank.id === selectedBankId)

    const handleWithdraw = () => {
        const withdrawAmount = parseFloat(amount)
        if (withdrawAmount > 0 && withdrawAmount <= availableAmount && selectedBank) {
            onSuccess(withdrawAmount, selectedBank)
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Withdraw Funds</h2>
            <p className="text-gray-600 mb-6">Available: ${availableAmount.toFixed(2)}</p>

            <div className="space-y-6">
                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount to withdraw
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={availableAmount.toFixed(2)}
                            max={availableAmount}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Maximum: ${availableAmount.toFixed(2)}</p>
                </div>

                {/* Bank Account Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select bank account
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-900">
                                    {selectedBank?.name} {selectedBank?.accountNumber}
                                    {selectedBank?.isDefault && " (Default)"}
                                </span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                {bankAccounts.map((bank) => (
                                    <button
                                        key={bank.id}
                                        onClick={() => {
                                            if (!bank.isDisabled) {
                                                setSelectedBankId(bank.id)
                                                setIsDropdownOpen(false)
                                            }
                                        }}
                                        className={`w-full flex items-center space-x-3 p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                            bank.isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={bank.isDisabled}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${
                                            bank.isDisabled ? 'bg-gray-300' : 'bg-green-500'
                                        }`}></div>
                                        <span className="text-gray-900">
                                            {bank.name} {bank.accountNumber}
                                            {bank.isDefault && " (Default)"}
                                        </span>
                                    </button>
                                ))}
                                <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-green-600 border-t border-gray-100 rounded-b-lg">
                                    <Plus className="w-4 h-4" />
                                    <span>Add new bank account</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                    Cancel
                </Button>
                <Button 
                    onClick={handleWithdraw}
                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableAmount}
                    className="flex-1"
                >
                    Withdraw
                </Button>
            </div>
        </div>
    )
}

// Success Modal Content
interface SuccessModalProps {
    amount: number
    bankAccount: BankAccount
    onBackToDashboard: () => void
}

function SuccessModalContent({ amount, bankAccount, onBackToDashboard }: SuccessModalProps) {
    const referenceNumber = "WD-98765432"

    return (
        <div className="p-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Withdrawal Successful</h2>
            <p className="text-gray-600 mb-8">Your funds are on the way</p>

            {/* Details */}
            <div className="space-y-4 text-left bg-gray-50 rounded-lg p-4 mb-8">
                <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">To</span>
                    <span className="font-semibold">{bankAccount.name} {bankAccount.accountNumber}</span>
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

            <Button onClick={onBackToDashboard} className="w-full">
                Back to Dashboard
            </Button>
        </div>
    )
}

const transactions: Transaction[] = [
    {
        id: "1",
        supporterEmail: "sarah@gmail.com",
        amount: 25.0,
        postTitle: "Advanced Photography Tips",
        postImage: "/photography-camera-equipment.jpg",
        date: "April 30, 2024",
    },
    {
        id: "2",
        supporterEmail: "sarah@gmail.com",
        amount: 15.5,
        postTitle: "Digital Art Collection Vol. 3",
        postImage: "/photography-camera-equipment.jpg",
        date: "April 28, 2024",
    },
    {
        id: "3",
        supporterEmail: "sarah@gmail.com",
        amount: 30.0,
        postTitle: "Music Production Guide",
        postImage: "/photography-camera-equipment.jpg",
        date: "April 27, 2024",
    },
    {
        id: "4",
        supporterEmail: "sarah@gmail.com",
        amount: 10.0,
        postTitle: "Graphic Design Essentials",
        postImage: "/photography-camera-equipment.jpg",
        date: "April 25, 2024",
    },
    {
        id: "5",
        supporterEmail: "sarah@gmail.com",
        amount: 20.0,
        postTitle: "Creative Writing Workshop",
        postImage: "/photography-camera-equipment.jpg",
        date: "April 23, 2024",
    },
    {
        id: "6",
        supporterEmail: "sarah@gmail.com",
        amount: 15.0,
        postTitle: "UX/UI Design Principles",
        postImage: "/photography-camera-equipment.jpg",
        date: "April 22, 2024",
    },
]

export default function EarningsPage() {
    const [modalType, setModalType] = useState<"none" | "withdraw" | "success">("none")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [withdrawalData, setWithdrawalData] = useState<{
        amount: number
        bankAccount: BankAccount
    } | null>(null)

    const totalEarnings = 2487.5
    const monthlyEarned = 653.25
    const recentTips = 127.5
    const availableForWithdrawal = 384.75
    const pendingClearance = 118.5

    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.supporterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.postTitle.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const itemsPerPage = 6
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className={`${typography.h1} mb-6 md:mb-8`}>Earnings Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <StatCard
                    title="Total Earnings"
                    value={`$${totalEarnings.toLocaleString()}`}
                    icon={DollarSign}
                />
                <StatCard
                    title="Monthly Earned"
                    value={`$${monthlyEarned.toLocaleString()}`}
                    icon={TrendingUp}
                />
                <StatCard
                    title="Recent Tips (7 days)"
                    value={`$${recentTips.toLocaleString()}`}
                    icon={Wallet}
                />
            </div>

            {/* Withdrawal Section */}
            {/* <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-6"> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 md:mb-8">
                <div className={`bg-white rounded-lg border border-gray-200 p-3 md:p-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet className={`w-5 h-5 text-${colors.primary}`} />
                                <span className="text-sm font-medium text-gray-600">Available for Withdrawal</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">${availableForWithdrawal.toLocaleString()}</p>
                        </div>
                        <Button onClick={() => setModalType("withdraw")}>Withdraw</Button>
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-600">Pending Clearance</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">${pendingClearance.toLocaleString()}</p>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 md:p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h2 className={`${typography.h2}`}>Total Earnings</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search transactions"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Transaction List */}
                <div className="md:hidden">
                    {paginatedTransactions.map((transaction) => (
                        <div key={transaction.id} className="p-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center gap-3 mb-2">
                                <Image
                                    src={transaction.postImage || "/placeholder.svg"}
                                    alt={transaction.postTitle}
                                    className="w-10 h-10 rounded-lg object-cover"
                                    width={1000}
                                    height={1000}
                                    priority
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{transaction.postTitle}</p>
                                    <p className="text-sm text-gray-500">{transaction.supporterEmail}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold text-${colors.primary}`}>${transaction.amount.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">{transaction.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Transaction Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Supporter Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Post Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.supporterEmail}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-semibold text-${colors.primary}`}>
                                            ${transaction.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={transaction.postImage || "/placeholder.svg"}
                                                alt={transaction.postTitle}
                                                className="w-10 h-10 rounded-lg object-cover"
                                                width={1000}
                                                height={1000}
                                                priority
                                            />
                                            <span className="text-sm font-medium text-gray-900">{transaction.postTitle}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of{" "}
                        {filteredTransactions.length} transactions
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="text-sm"
                        >
                            Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "primary" : "outline"}
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 p-0 text-sm"
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className="text-sm"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal */}
            <Modal 
                isOpen={modalType === "withdraw"} 
                onClose={() => setModalType("none")}
            >
                <WithdrawalModalContent
                    availableAmount={availableForWithdrawal}
                    onSuccess={(amount, bankAccount) => {
                        setWithdrawalData({ amount, bankAccount })
                        setModalType("success")
                    }}
                    onCancel={() => setModalType("none")}
                />
            </Modal>

            {/* Success Modal */}
            <Modal 
                isOpen={modalType === "success"} 
                onClose={() => setModalType("none")}
            >
                {withdrawalData && (
                    <SuccessModalContent
                        amount={withdrawalData.amount}
                        bankAccount={withdrawalData.bankAccount}
                        onBackToDashboard={() => setModalType("none")}
                    />
                )}
            </Modal>
        </div>
    )
}
