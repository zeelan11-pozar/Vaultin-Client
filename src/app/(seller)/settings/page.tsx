"use client"

import React, { useEffect } from "react"
import { useState } from "react"
import { colors } from "@/lib/colors"
import { typography } from "@/lib/typography"
import { CreditCard, Plus, ChevronDown, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/buttons"
import { useLogoutMutation } from "@/services/mutations/authMutations"
import { notify } from "@/lib/toast"
import { useUpdatePasswordMutation, useUpdateUserMutation } from "@/services/mutations/userMutations"
import { CustomButton } from "@/components/ui/custom-button"
import { useGetMeQuery } from "@/services/queries/userQueries"
import Loading from "../loading"

// Local Checkbox component
const Checkbox = ({
    checked,
    onCheckedChange,
    children,
}: {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    children: React.ReactNode
}) => {
    return (
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className={`w-4 h-4 rounded border-2 border-gray-300 text-[${colors.primary}] focus:ring-[${colors.primary}] focus:ring-2`}
            />
            <span className="text-sm text-gray-700">{children}</span>
        </label>
    )
}

// Local Input component
const Input = ({
    value,
    onChange,
    placeholder,
    className = "",
    disabled = false,
    type = "text",
    maxLength,
    showPasswordToggle = false,
    ...props
}: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    type?: string
    maxLength?: number
    showPasswordToggle?: boolean
}) => {
    const [showPassword, setShowPassword] = useState(false)

    const inputType = type === "password" && showPasswordToggle ? (showPassword ? "text" : "password") : type

    return (
        <div className="relative">
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={`w-full px-3 py-2 ${showPasswordToggle ? 'pr-10' : ''} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[${colors.primary}] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
                {...props}
            />
            {showPasswordToggle && type === "password" && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    disabled={disabled}
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}
        </div>
    )
}

// Local Textarea component
const Textarea = ({
    value,
    onChange,
    placeholder,
    rows = 3,
    className = "",
    ...props
}: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    rows?: number
    className?: string
}) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[${colors.primary}] focus:border-transparent resize-none ${className}`}
            {...props}
        />
    )
}

// Local Dialog components
const Dialog = ({
    open,
    onOpenChange,
    children,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
            <div className="relative z-10">{children}</div>
        </div>
    )
}

const DialogTrigger = ({
    asChild,
    children,
}: {
    asChild?: boolean
    children: React.ReactNode
}) => {
    return <>{children}</>
}

const DialogContent = ({
    children,
    className = "",
}: {
    children: React.ReactNode
    className?: string
}) => {
    return <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 ${className}`}>{children}</div>
}

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
    return <div className="mb-4">{children}</div>
}

const DialogTitle = ({ children }: { children: React.ReactNode }) => {
    return <h2 className={`${typography.h2} text-gray-900`}>{children}</h2>
}

// Local Select components
const Select = ({
    value,
    onValueChange,
    children,
}: {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        isOpen,
                        setIsOpen,
                        value,
                        onValueChange,
                    })
                }
                return child
            })}
        </div>
    )
}

const SelectTrigger = ({
    children,
    className = "",
    isOpen,
    setIsOpen,
}: {
    children: React.ReactNode
    className?: string
    isOpen?: boolean
    setIsOpen?: (open: boolean) => void
}) => {
    return (
        <button
            type="button"
            onClick={() => setIsOpen?.(!isOpen)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[${colors.primary}] focus:border-transparent flex items-center justify-between ${className}`}
        >
            {children}
            <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
    )
}

const SelectValue = ({
    placeholder,
    value,
}: {
    placeholder?: string
    value?: string
}) => {
    return <span className="text-gray-900">{value || placeholder}</span>
}

const SelectContent = ({
    children,
    isOpen,
    setIsOpen,
    onValueChange,
}: {
    children: React.ReactNode
    isOpen?: boolean
    setIsOpen?: (open: boolean) => void
    onValueChange?: (value: string) => void
}) => {
    if (!isOpen) return null

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        setIsOpen,
                        onValueChange,
                    })
                }
                return child
            })}
        </div>
    )
}

const SelectItem = ({
    value,
    children,
    setIsOpen,
    onValueChange,
}: {
    value: string
    children: React.ReactNode
    setIsOpen?: (open: boolean) => void
    onValueChange?: (value: string) => void
}) => {
    return (
        <button
            type="button"
            onClick={() => {
                onValueChange?.(value)
                setIsOpen?.(false)
            }}
            className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
        >
            {children}
        </button>
    )
}

export default function SettingsPage() {
    const { data: me, isLoading: isMeLoading, isError: isMeError, isSuccess: isMeSuccess } = useGetMeQuery();
    const logoutMutation = useLogoutMutation();
    const updatePasswordMutation = useUpdatePasswordMutation();
    const updateUserMutation = useUpdateUserMutation();

    const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false)
    const [bankForm, setBankForm] = useState({
        bankName: "",
        accountType: "",
        routingNumber: "",
        accountNumber: "",
        confirmAccountNumber: "",
        setAsDefault: false,
    })

    const [profileForm, setProfileForm] = useState({
        firstName: me?.data?.firstName,
        lastName: me?.data?.lastName,
        email: me?.data?.email,
        username: me?.data?.userName,
    })

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    })

    const [bankAccounts] = useState([
        {
            id: 1,
            name: "Bank Account",
            details: "••••••8732 • Checking Account",
            isDefault: true,
        },
    ])

    useEffect(() => {
        if (isMeSuccess) {
            setProfileForm({
                firstName: me?.data?.firstName,
                lastName: me?.data?.lastName,
                email: me?.data?.email,
                username: me?.data?.userName,
            })

        }
    }, [isMeSuccess])

    if (isMeLoading) {
        return <Loading />
    }

    if (isMeError) {
        return (
            <div className="flex justify-center items-center py-16">
                <span className="text-red-500 text-lg font-medium">Error</span>
                <span className="text-red-500 text-lg font-medium">{me?.message}</span>
            </div>
        )
    }

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                window.location.reload();
            },
            onError: (error: any) => {
                notify(error?.response?.data?.message, 'error')
            }
        })
    }

    const handleAddBank = () => {
        // Handle bank account addition
        console.log("[v0] Adding bank account:", bankForm)
        setIsAddBankModalOpen(false)
        setBankForm({
            bankName: "",
            accountType: "",
            routingNumber: "",
            accountNumber: "",
            confirmAccountNumber: "",
            setAsDefault: false,
        })
    }

    const handleSaveProfile = () => {
        console.log("[v0] Saving profile:", profileForm)
        updateUserMutation.mutate({
            firstName: profileForm.firstName,
            lastName: profileForm.lastName,
        }, {
            onSuccess: () => {
                notify("Profile updated successfully", 'success')
                // setProfileForm({
                //     firstName: me?.data?.firstName,
                //     lastName: me?.data?.lastName,
                //     email: me?.data?.email,
                //     username: me?.data?.userName,
                // })
            },
            onError: (error: any) => {
                notify(error?.response?.data?.message, 'error')
            }
        })

    }

    const handleSavePassword = () => {
        // Validation: Check if new password and confirm password match
        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            notify("New password and confirm password must match", 'error')
            return
        }

        // Validation: Check if all fields are filled
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
            notify("Please fill in all password fields", 'error')
            return
        }

        // Validation: Check minimum password length
        if (passwordForm.newPassword.length < 8) {
            notify("New password must be at least 8 characters long", 'error')
            return
        }

        console.log("[v0] Saving password:", passwordForm)
        updatePasswordMutation.mutate({ oldPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }, {
            onSuccess: () => {
                notify("Password updated successfully", 'success')
                // Reset form after successful update
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                })
            },
            onError: (error: any) => {
                notify(error?.response?.data?.message, 'error')
            }
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Desktop Header */}
            <div className=" md:block mb-8">
                <h1 className={`${typography.h1} text-gray-900`}>Account Info</h1>
            </div>

            <div className="space-y-8">
                {/* Profile Information Section */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6">
                        <h2 className={`${typography.h2} text-gray-900 mb-6`}>Profile Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <Input
                                    value={profileForm.firstName || ""}
                                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                    placeholder="Enter your first name"
                                    disabled={updateUserMutation.isPending}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <Input
                                    value={profileForm.lastName || ""}
                                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                    placeholder="Enter your last name"
                                    disabled={updateUserMutation.isPending}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <Input
                                    value={profileForm.email || ""}
                                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                    placeholder="Enter your email"
                                    className="bg-gray-100"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                <Input
                                    value={profileForm.username || ""}
                                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                                    placeholder="Enter your username"
                                    disabled={true}
                                />
                            </div>
                        </div>

                        {/* <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                            <Textarea
                                value={profileForm.bio}
                                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                placeholder="Tell us about yourself"
                                rows={3}
                            />
                        </div> */}

                        <div className="flex justify-end">
                            <CustomButton onClick={handleSaveProfile} disabled={updateUserMutation.isPending} loading={updateUserMutation.isPending}>Save Changes</CustomButton>
                        </div>
                    </div>
                </div>

                {/* Banking Details Section */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6">
                        <h2 className={`${typography.h2} text-gray-900 mb-6`}>Banking Details</h2>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Payment Methods</h3>

                            {bankAccounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 bg-blue-200 rounded-lg p-2 text-black">
                                            <CreditCard className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{account.name}</p>
                                            <p className="text-sm text-gray-500">{account.details}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {account.isDefault && (
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full bg-blue-500 text-white`}
                                            >
                                                Default
                                            </span>
                                        )}
                                        <button className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setIsAddBankModalOpen(true)}>Edit</button>

                                    </div>
                                </div>
                            ))}

                            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 p-4 border-2 border-dashed border-gray-300 rounded-lg w-full justify-center" onClick={() => setIsAddBankModalOpen(true)}>
                                <Plus className="w-4 h-4" />
                                <span>Add New Payment Method</span>
                            </button>

                            <Dialog open={isAddBankModalOpen} onOpenChange={setIsAddBankModalOpen}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add Bank Account</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                                            <Input
                                                value={bankForm.bankName}
                                                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                                                placeholder="Enter bank name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                                            <Select
                                                value={bankForm.accountType}
                                                onValueChange={(value) => setBankForm({ ...bankForm, accountType: value })}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select account type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="checking">Checking</SelectItem>
                                                    <SelectItem value="savings">Savings</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                                            <Input
                                                value={bankForm.routingNumber}
                                                onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
                                                placeholder="9-digit routing number"
                                                maxLength={9}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                            <Input
                                                value={bankForm.accountNumber}
                                                onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                                                placeholder="Enter account number"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Account Number</label>
                                            <Input
                                                value={bankForm.confirmAccountNumber}
                                                onChange={(e) => setBankForm({ ...bankForm, confirmAccountNumber: e.target.value })}
                                                placeholder="Re-enter account number"
                                            />
                                        </div>

                                        <Checkbox
                                            checked={bankForm.setAsDefault}
                                            onCheckedChange={(checked) => setBankForm({ ...bankForm, setAsDefault: checked })}
                                        >
                                            Set as default payment method
                                        </Checkbox>

                                        <div className="flex space-x-3 pt-4">
                                            <Button variant="secondary" onClick={() => setIsAddBankModalOpen(false)} className="flex-1">
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleAddBank}
                                                className="flex-1"
                                            // disabled={
                                            //     !bankForm.bankName ||
                                            //     !bankForm.accountType ||
                                            //     !bankForm.routingNumber ||
                                            //     !bankForm.accountNumber ||
                                            //     bankForm.accountNumber !== bankForm.confirmAccountNumber
                                            // }
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6">
                        <h2 className={`${typography.h2} text-gray-900 mb-6`}>Security</h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <Input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                        disabled={updatePasswordMutation.isPending}
                                        showPasswordToggle={true}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                        <Input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            placeholder="Enter new password (min 8 characters)"
                                            disabled={updatePasswordMutation.isPending}
                                            showPasswordToggle={true}
                                        />
                                        {passwordForm.newPassword && passwordForm.newPassword.length < 8 && (
                                            <p className="text-sm text-red-600 mt-1">Password must be at least 8 characters long</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                        <Input
                                            type="password"
                                            value={passwordForm.confirmNewPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                            disabled={updatePasswordMutation.isPending}
                                            showPasswordToggle={true}
                                        />
                                        {passwordForm.confirmNewPassword && passwordForm.newPassword !== passwordForm.confirmNewPassword && (
                                            <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <CustomButton
                                onClick={handleSavePassword}
                                disabled={
                                    updatePasswordMutation.isPending ||
                                    !passwordForm.currentPassword ||
                                    !passwordForm.newPassword ||
                                    !passwordForm.confirmNewPassword ||
                                    passwordForm.newPassword !== passwordForm.confirmNewPassword ||
                                    passwordForm.newPassword.length < 8
                                }
                                loading={updatePasswordMutation.isPending}
                            >
                                Save Changes
                            </CustomButton>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 mt-8">
                    <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className={`${typography.h2} text-gray-900 mb-2`}>Logout</h2>
                            <p className="text-sm text-gray-600">Sign out of your account securely.</p>
                        </div>
                        <button
                            className="mt-4 md:mt-0 px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
