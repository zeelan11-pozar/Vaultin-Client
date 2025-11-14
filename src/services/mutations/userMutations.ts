import { useMutation } from "@tanstack/react-query";
import { checkUserNameAvailability, generatePresignedUrl, submitDocuments, updatePassword, updateUser } from "../apis/userApis";
import { GeneratePresignedUrlPayload, UpdateUserPayload } from "../../types";

export const useUpdateDocumentsMutation = () => {
    return useMutation({
        mutationFn: (payload: UpdateUserPayload) => submitDocuments(payload),
    });
};

export const useUpdateUserMutation = () => {
    return useMutation({
        mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    });
};

export const useCheckUserNameAvailabilityMutation = () => {
    return useMutation({
        mutationFn: (userName: string) => checkUserNameAvailability(userName),
    });
};

export const useGeneratePresignedUrlMutation = () => {
    return useMutation({
        mutationFn: (payload: GeneratePresignedUrlPayload) => generatePresignedUrl(payload),
    });
};

export const useUpdatePasswordMutation = () => {
    return useMutation({
        mutationFn: (payload: { oldPassword: string; newPassword: string }) => updatePassword(payload),
    });
};