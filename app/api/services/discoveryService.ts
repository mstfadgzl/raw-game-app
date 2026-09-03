import { IPlatformResponse } from "../../types/platform";
import apiClient from "../client";

export const DiscoveryService = {
    getPlatforms: async (page: number = 1): Promise<IPlatformResponse> => {
        const response = await apiClient.get<IPlatformResponse>('/platforms', {
            params: { page }
        });
        return response.data;
    },
    getPlatfomrDetail: async (id: number): Promise<IPlatformResponse> => {
        const response = await apiClient.get<IPlatformResponse>(`/platforms/${id}`);
        return response.data;

    }

}