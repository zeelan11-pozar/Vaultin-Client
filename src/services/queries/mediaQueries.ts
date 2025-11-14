import { useQuery } from "@tanstack/react-query";
import { getMedia, getMediaById } from "../apis/mediaApis";

export const useGetMediaQuery = (options = {}) => {
    return useQuery({
        queryKey: ['media'],
        queryFn: getMedia,
        ...options,
    });
};

export const useGetMediaByIdQuery = (id: string, options = {}) => {
    return useQuery({
        queryKey: ['media', id],
        queryFn: () => getMediaById(id),
        ...options,
    });
};