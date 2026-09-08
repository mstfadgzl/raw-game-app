import { ICreatorResponse, IDeveloperResponse } from "@types";
import apiClient from "../client"

export const entityService = {
    getCreators: async ({ page = 1, pageSize = 40 }): Promise<ICreatorResponse> => {
        const response = await apiClient.get<ICreatorResponse>('/creators', {
            params: {
                page,
                page_size: pageSize,
            }
        });
        return response.data;

    },
    getCreatorDetail: async (id: number): Promise<ICreatorResponse> => {
        const response = await apiClient.get<ICreatorResponse>(`/creators/${id}`);
        return response.data;
    },
    getDevelopers: async (page: number = 1): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>('/developers', {
            params: { page }
        });
        return response.data;
    },
    getDeveloperDetail: async (id: number): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>(`/developers/${id}`);
        return response.data;
    },
    getPublishers: async (page: number = 1): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>('/publishers', {
            params: { page }
        });
        return response.data;
    },
    getPublisherDetail: async (id: number): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>(`/publishers/${id}`);
        return response.data;
    },

}