import { useQuery } from "@tanstack/react-query";
import { getMe } from "../apis/userApis";

export const useGetMeQuery = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: getMe,
    });
};