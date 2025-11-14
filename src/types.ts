// Authentication types
export interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'SELLER' | 'BUYER';
}

export interface OtpVerificationData {
  email: string;
  otpCode: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'SELLER' | 'BUYER';
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

export type ResetPasswordVerifyOtpData = {
  email: string;
  otpCode: string;
};

export type ResetPasswordData = {
  resetToken: string;
  newPassword: string;
};

export interface UpdateUserPayload {
  userName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  aadharCardImageUrl?: string;
}

export interface UpdateUserResponse {
  message: string;
  data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    status: string;
    isEmailVerified: boolean;
    aadharCardImageUrl?: string;
    avatar?: string;
  };
}

export interface CheckUserNameAvailabilityResponse {
  success: boolean;
  isAvailable: boolean;
  message: string;
  data: boolean;
}

export type GeneratePresignedUrlPayload = {
  contentType: string;
  imageType: 'profile-picture' | 'aadhar-card' | 'post';
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
};

export type GeneratePresignedUrlResponse = {
  url: string;
  key: string;
};

export interface PostMediaPayload {
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
  price: number;
  currency?: string; // default is 'USD' if not provided
}

export interface PostMediaResponse {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileSize: string; // BigInt serialized as string
  mimeType: string;
  url: string;
  thumbnailUrl: string | null;
  duration: number | null;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'DELETED';
  // Add other fields returned by the API as needed
}

export interface ListContentFilesResponse {
  success: boolean;
  message: string;
  data: {
    contentFiles: PostMediaResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SingleContentFileResponse {
  success: boolean;
  message: string;
  data: PostMediaResponse;
}

export interface GetMeResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    avatar: string;
  };
}