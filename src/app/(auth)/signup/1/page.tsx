"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Info } from "lucide-react"
import { InputField } from "@/components/ui/input-field"
import { CustomButton } from "@/components/ui/custom-button"
import { FileUpload } from "@/components/ui/file-upload"
import { ProgressBar } from "@/components/ui/progress-bar"
import { SecurityFeatures } from "@/components/security-features"
import { typography } from "@/lib/typography"
import imageCompression from "browser-image-compression";
import { useCheckUserNameAvailabilityMutation, useGeneratePresignedUrlMutation, useUpdateDocumentsMutation } from "@/services/mutations/userMutations";
import { notify } from "@/lib/toast";

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    profilePicture: null as File | null,
    aadhaarCard: null as File | null,
  })
  const [uploadingFiles, setUploadingFiles] = useState({
    profilePicture: false,
    aadhaarCard: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateUserMutation = useUpdateDocumentsMutation();
  const checkUserNameAvailabilityMutation = useCheckUserNameAvailabilityMutation();
  const generatePresignedUrlMutation = useGeneratePresignedUrlMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileSelect = (field: string) => async (file: File) => {
    try {
      const compressedFile = await compressImage(file);
      setFormData((prev) => ({
        ...prev,
        [field]: compressedFile,
      }))
    } catch (error) {
      console.error('Error handling file:', error);
      notify('Failed to process file', 'error');
    }
  }

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      useWebWorker: true,
    }
    return await imageCompression(file, options)
  }

  const uploadFile = async (file: File, fileType: 'profilePicture' | 'aadhaarCard'): Promise<string> => {
    try {
      // Generate presigned URL
      const imageType = fileType === 'profilePicture' ? 'profile-picture' : 'aadhar-card';
      const presignedUrlResponse = await generatePresignedUrlMutation.mutateAsync({
        contentType: file.type,
        imageType,
        mediaType: 'IMAGE'
      });

      // Upload file to S3
      const uploadResponse = await fetch(presignedUrlResponse.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      notify(`${fileType === 'profilePicture' ? 'Profile picture' : 'Aadhaar card'} uploaded successfully`, 'success');
      return presignedUrlResponse.key;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error(`Failed to upload ${fileType === 'profilePicture' ? 'profile picture' : 'Aadhaar card'}`);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      notify('Please enter a username', 'error');
      return;
    }

    if (!formData.profilePicture) {
      notify('Please select a profile picture', 'error');
      return;
    }

    if (!formData.aadhaarCard) {
      notify('Please select your Aadhaar card', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check username availability first
      const availabilityResponse = await checkUserNameAvailabilityMutation.mutateAsync(formData.username);
      
      if (!availabilityResponse.isAvailable) {
        notify('Username is not available. Please choose a different one.', 'error');
        setIsSubmitting(false);
        return;
      }

      // Upload profile picture first
      setUploadingFiles(prev => ({ ...prev, profilePicture: true }));
      const profilePictureKey = await uploadFile(formData.profilePicture, 'profilePicture');
      setUploadingFiles(prev => ({ ...prev, profilePicture: false }));

      // Upload Aadhaar card second
      setUploadingFiles(prev => ({ ...prev, aadhaarCard: true }));
      const aadhaarCardKey = await uploadFile(formData.aadhaarCard, 'aadhaarCard');
      setUploadingFiles(prev => ({ ...prev, aadhaarCard: false }));

      // Update user with all the data
      await updateUserMutation.mutateAsync({
        userName: formData.username,
        avatar: profilePictureKey,
        aadharCardImageUrl: aadhaarCardKey,
      });

      notify('Profile updated successfully!', 'success');
      router.push('/signup/2');
    } catch (error) {
      console.error('Submission failed:', error);
      notify('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
      setUploadingFiles({ profilePicture: false, aadhaarCard: false });
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <ProgressBar currentStep={1} totalSteps={2} stepLabel="Verification" />

      <div className="text-center space-y-2">
        <h1 className={typography.h3}>Complete Your Profile</h1>
        <p className={typography.subtitle}>Upload verification documents</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Username"
          name="username"
          type="text"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInputChange}
          icon={<User className="h-4 w-4 text-neutral-400" />}
        />
        <p className={typography.bodySmall}>Your username will be visible to other users</p>

        <FileUpload 
          label="Profile Picture" 
          icon="camera" 
          onFileSelect={handleFileSelect("profilePicture")} 
          isUploading={uploadingFiles.profilePicture}
          isUploaded={false}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className={typography.label}>Aadhaar Card</label>
            <div className="group relative">
              <Info className="h-4 w-4 text-neutral-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Government issued identity verification
              </div>
            </div>
          </div>
          <FileUpload
            label=""
            description=""
            acceptedTypes="JPEG, PNG or PDF up to 5MB"
            icon="document"
            onFileSelect={handleFileSelect("aadhaarCard")}
            isUploading={uploadingFiles.aadhaarCard}
            isUploaded={false}
          />
        </div>

        <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className={typography.label}>Your information is secure</span>
          </div>
          <div className="space-y-2 ml-7">
            <p className={typography.bodySmall}>We require identification to:</p>
            <ul className="space-y-1">
              <li className={typography.bodySmall}>• Verify your identity and prevent fraud</li>
              <li className={typography.bodySmall}>• Comply with legal requirements</li>
              <li className={typography.bodySmall}>• Protect content creators and consumers</li>
            </ul>
            <p className={typography.bodySmall}>
              Your ID is encrypted and stored securely. We never share your personal information with unauthorized
              parties.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <CustomButton type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
            Back
          </CustomButton>
          <CustomButton 
            type="submit" 
            className="flex-1"
            loading={isSubmitting || uploadingFiles.profilePicture || uploadingFiles.aadhaarCard}
            disabled={!formData.username.trim() || !formData.profilePicture || !formData.aadhaarCard}
          >
            Continue
          </CustomButton>
        </div>
      </form>

      <SecurityFeatures />
    </div>
  )
}
