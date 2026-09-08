import { ITagResponse } from "@types";
import { IPlatformResponse } from "../../types/platform";
import { IStoreResponse } from "../../types/store";
import apiClient from "../client";

export const discoveryService = {
    getPlatforms: async (page: number = 1): Promise<IPlatformResponse> => {
        const response = await apiClient.get<IPlatformResponse>('/platforms', {
            params: { page }
        });
        return response.data;
    },
    getPlatfomrDetail: async (id: number): Promise<IPlatformResponse> => {
        const response = await apiClient.get<IPlatformResponse>(`/platforms/${id}`);
        return response.data;
    },
    getStores: async (page: number = 1): Promise<IStoreResponse> => {
        const response = await apiClient.get<IStoreResponse>('/stores', {
            params: { page }
        });
        return response.data;
    },
    getTags: async ({ page = 1, pageSize = 40 }): Promise<ITagResponse> => {
        const response = await apiClient.get<ITagResponse>('/tags', {
            params: {
                page,
                page_size: pageSize,
            }
        });
        return response.data;
    },
    getTagDetail: async (id: number): Promise<ITagResponse> => {
        const response = await apiClient.get<ITagResponse>(`/tags/${id}`);
        return response.data;
    },

}