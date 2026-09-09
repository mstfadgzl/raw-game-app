import { ICreator, ICreatorResponse, IDeveloper, IDeveloperResponse } from "@types";
import apiClient from "../client"

export const entityService = {
    searchDevelopers: async (query: string, page: number, signal?: AbortSignal): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>('/developers', {
            params: { search: query.trim(), page, page_size: 20 },
            signal,
        });
        return response.data;
    },
    getCreators: async ({ page = 1, pageSize = 40 }): Promise<ICreatorResponse> => {
        const response = await apiClient.get<ICreatorResponse>('/creators', {
            params: {
                page,
                page_size: pageSize,
            }
        });
        return response.data;

    },
    getCreatorDetail: async (id: number): Promise<ICreator> => {
        const response = await apiClient.get<ICreator>(`/creators/${id}`);
        return response.data;
    },
    getDevelopers: async (page: number = 1): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>('/developers', {
            params: { page }
        });
        return response.data;
    },
    getDeveloperDetail: async (id: number): Promise<IDeveloper> => {
        const response = await apiClient.get<IDeveloper>(`/developers/${id}`);
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
