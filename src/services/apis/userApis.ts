import { CheckUserNameAvailabilityResponse, GeneratePresignedUrlPayload, GeneratePresignedUrlResponse, GetMeResponse, UpdateUserPayload, UpdateUserResponse } from '@/types';
import axiosInstance from './index';

export const submitDocuments = async (
    payload: UpdateUserPayload
): Promise<UpdateUserResponse> => {
    console.log('[INIT] => /api/auth/submit-details');
    const response = await axiosInstance.patch('/api/auth/submit-details', payload);
    console.log('[OK] => /api/auth/submit-details', response.data);
    return response.data;
};

export const updateUser = async (
    payload: UpdateUserPayload
): Promise<UpdateUserResponse> => {
    console.log('[INIT] => /api/user/update');
    const response = await axiosInstance.patch('/api/user/update', payload);
    console.log('[OK] => /api/user/update', response.data);
    return response.data;
};


export const checkUserNameAvailability = async (
    userName: string
): Promise<CheckUserNameAvailabilityResponse> => {
    console.log(`[INIT] => /api/user/user-name-already-exists/${userName}`);
    const response = await axiosInstance.get(`/api/user/user-name-already-exists/${encodeURIComponent(userName)}`);
    console.log('[OK] => /api/user/user-name-already-exists', response.data);
    return response.data;
};

export const generatePresignedUrl = async (
    payload: GeneratePresignedUrlPayload
): Promise<GeneratePresignedUrlResponse> => {
    console.log('[INIT] => /api/user/generate-presigned-url');
    const response = await axiosInstance.post('/api/user/generate-presigned-url', payload);
    console.log('[OK] => /api/user/generate-presigned-url', response.data);
    return response.data;
};


export const updatePassword = async (
    payload: { oldPassword: string; newPassword: string }
): Promise<{ success: boolean; message: string }> => {
    console.log('[INIT] => /api/user/update-password');
    const response = await axiosInstance.patch('/api/user/update-password', payload);
    console.log('[OK] => /api/user/update-password', response.data);
    return response.data;
};

export const getMe = async (): Promise<GetMeResponse> => {
    console.log('[INIT] => /api/user/me');
    const response = await axiosInstance.get('/api/user/me');
    console.log('[OK] => /api/user/me', response.data);
    return response.data;
};
