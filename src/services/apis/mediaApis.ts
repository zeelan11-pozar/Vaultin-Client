import { ListContentFilesResponse, PostMediaPayload, PostMediaResponse, SingleContentFileResponse } from '@/types';
import axiosInstance from './index';

export const postMedia = async (
    payload: PostMediaPayload
): Promise<PostMediaResponse> => {
    console.log('[INIT] => /api/media');
    // Ensure currency defaults to 'USD' if not provided
    const dataToSend = { ...payload, currency: payload.currency ?? 'USD' };
    const response = await axiosInstance.post('/api/media', dataToSend);
    console.log('[OK] => /api/media', response.data);
    return response.data;
};

export const getMedia = async (): Promise<ListContentFilesResponse> => {
    console.log('[INIT] => GET /api/media/my-content');
    const response = await axiosInstance.get('/api/media/my-content');
    console.log('[OK] => GET /api/media/my-content', response.data);
    return response.data;
};

export const getMediaById = async (id: string): Promise<SingleContentFileResponse> => {
    console.log(`[INIT] => GET /api/media/${id}`);
    const response = await axiosInstance.get(`/api/media/${id}`);
    console.log(`[OK] => GET /api/media/${id}`, response.data);
    return response.data;
};

export const deleteMediaById = async (id: string): Promise<{ success: boolean; message: string }> => {
    console.log(`[INIT] => DELETE /api/media/${id}`);
    const response = await axiosInstance.delete(`/api/media/${id}`);
    console.log(`[OK] => DELETE /api/media/${id}`, response.data);
    return response.data;
};
