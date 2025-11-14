import { useMutation } from "@tanstack/react-query";
import { deleteMediaById, postMedia } from "../apis/mediaApis";
import { PostMediaPayload } from "../../types";

export const usePostMediaMutation = () => {
  return useMutation({
    mutationFn: (payload: PostMediaPayload) => postMedia(payload),
  });
};

export const useDeleteMediaByIdMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteMediaById(id),
  });
};