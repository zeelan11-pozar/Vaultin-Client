import { useMutation } from "@tanstack/react-query";
import { 
  signUp, 
  verifyOtp, 
  login, 
  refreshToken, 
  logout, 
  resendOtp,
  requestResetPasswordOtp,
  resetPasswordVerifyOtp,
  resetPassword
} from "../apis/authApis";
import { 
  SignUpData, 
  OtpVerificationData, 
  LoginData, 
  ResetPasswordVerifyOtpData,
  ResetPasswordData
} from "../../types";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (payload: SignUpData) => signUp(payload),
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: (payload: OtpVerificationData) => verifyOtp(payload),
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (payload: LoginData) => login(payload),
  });
};

export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: () => refreshToken(),
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => logout(),
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: (payload: { email: string }) => resendOtp(payload),
  });
};

export const useRequestResetPasswordOtpMutation = () => {
  return useMutation({
    mutationFn: (email: string) => requestResetPasswordOtp(email),
  });
};

export const useResetPasswordVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordVerifyOtpData) => resetPasswordVerifyOtp(payload),
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordData) => resetPassword(payload),
  });
};
