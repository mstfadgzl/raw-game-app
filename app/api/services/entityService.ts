import { ICreatorResponse, IDeveloperResponse } from "@types";
import apiClient from "../client"

export const EntityService = {
    getCreators: async (): Promise<ICreatorResponse> => {
        const response = await apiClient.get<ICreatorResponse>('/creators');
        return response.data;

    },
    getCreatorDetail: async (id: number): Promise<ICreatorResponse> => {
        const response = await apiClient.get<ICreatorResponse>(`/creators/${id}`);
        return response.data;
    },
    getDevelopers: async (): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>('/developers');
        return response.data;
    },
    getDeveloperDetail: async (id: number): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>(`/developers/${id}`);
        return response.data;
    }




}