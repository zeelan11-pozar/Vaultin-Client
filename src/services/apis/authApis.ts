import axiosInstance, { setAccessToken } from './index';
import {
    SignUpData,
    OtpVerificationData,
    LoginData,
    AuthResponse,
    RefreshTokenResponse,
    LogoutResponse,
    ResetPasswordVerifyOtpData,
    ResetPasswordData
} from '../../types';

export const signUp = async (payload: SignUpData): Promise<AuthResponse> => {
    console.log('[INIT] => /api/auth/signup');
    const response = await axiosInstance.post('/api/auth/signup', payload);
    console.log('[OK] => /api/auth/signup', response.data);
    return response.data;
};

export const verifyOtp = async (payload: OtpVerificationData): Promise<AuthResponse> => {
    console.log('[INIT] => /api/auth/verify-otp');
    const response = await axiosInstance.post('/api/auth/verify-otp', payload);
    setAccessToken(response.data.data.accessToken);
    console.log('[OK] => /api/auth/verify-otp', response.data);
    return response.data;
};

export const login = async (payload: LoginData): Promise<AuthResponse> => {
    console.log('[INIT] => /api/auth/login');
    const response = await axiosInstance.post('/api/auth/login', payload);
    setAccessToken(response.data.data.accessToken);
    console.log('[OK] => /api/auth/login', response.data);
    return response.data;
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
    console.log('[INIT] => /api/auth/refresh-token');
    const response = await axiosInstance.post('/api/auth/refresh-token');
    setAccessToken(response.data.data.accessToken);
    console.log('[OK] => /api/auth/refresh-token', response.data);
    return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
    console.log('[INIT] => /api/auth/logout');
    const response = await axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
    setAccessToken(null);
    console.log('[OK] => /api/auth/logout', response.data);
    return response.data;
};

export const resendOtp = async (payload: { email: string }): Promise<{ message: string }> => {
    console.log('[INIT] => /api/auth/resend-otp');
    const response = await axiosInstance.post('/api/auth/resend-otp', payload);
    console.log('[OK] => /api/auth/resend-otp', response.data);
    return response.data;
};

export const requestResetPasswordOtp = async (email: string): Promise<{ message: string }> => {
    console.log('[INIT] => /api/auth/reset-password/request-otp');
    const response = await axiosInstance.post('/api/auth/reset-password/request-otp', { email });
    console.log('[OK] => /api/auth/reset-password/request-otp', response.data);
    return response.data;
};

export const resetPasswordVerifyOtp = async (
    payload: ResetPasswordVerifyOtpData
): Promise<{ resetToken: string }> => {
    console.log('[INIT] => /api/auth/reset-password/verify-otp');
    const response = await axiosInstance.post('/api/auth/reset-password/verify-otp', payload);
    console.log('[OK] => /api/auth/reset-password/verify-otp', response.data);
    return response.data;
};

export const resetPassword = async (
    payload: ResetPasswordData
): Promise<{ message: string }> => {
    console.log('[INIT] => /api/auth/reset-password/reset');
    const response = await axiosInstance.post('/api/auth/reset-password/reset', payload);
    console.log('[OK] => /api/auth/reset-password/reset', response.data);
    return response.data;
};
