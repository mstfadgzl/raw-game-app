import { cachedGet, peekCached } from '../request-cache';
import { ICreator, ICreatorResponse, IDeveloper, IDeveloperResponse } from "@types";
import apiClient from "../client"

const matchesProfile = (value: unknown, id: number): boolean =>
    typeof value === 'object' && value !== null &&
    Number((value as { id?: unknown }).id) === id;

export const entityService = {
    searchDevelopers: async (query: string, page: number, signal?: AbortSignal): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>('/developers', {
            params: { search: query.trim(), page, page_size: 20 },
            signal,
        });
        return response.data;
    },
    getCreators: async ({ page = 1, pageSize = 40, search, signal }: { page?: number; pageSize?: number; search?: string; signal?: AbortSignal }): Promise<ICreatorResponse> => {
        const response = await apiClient.get<ICreatorResponse>('/creators', {
            params: {
                page,
                page_size: pageSize,
                search: search?.trim() || undefined,
            },
            signal,
        });
        return response.data;

    },
    peekCreatorDetail: (id: number): ICreator | null =>
        peekCached<ICreator>(`/creators/${id}`),
    getCreatorDetail: async (id: number, forceRefresh = false): Promise<ICreator> => {
        return cachedGet<ICreator>(`/creators/${id}`, {}, {
            forceRefresh,
            validate: value => matchesProfile(value, id),
        });
    },
    getDevelopers: async (page: number = 1): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>('/developers', {
            params: { page }
        });
        return response.data;
    },
    peekDeveloperDetail: (id: number): IDeveloper | null =>
        peekCached<IDeveloper>(`/developers/${id}`),
    getDeveloperDetail: async (id: number, forceRefresh = false): Promise<IDeveloper> => {
        return cachedGet<IDeveloper>(`/developers/${id}`, {}, {
            forceRefresh,
            validate: value => matchesProfile(value, id),
        });
    },
    getPublishers: async (page: number = 1): Promise<IDeveloperResponse> => {
        const response = await apiClient.get<IDeveloperResponse>('/publishers', {
            params: { page }
        });
        return response.data;
    },
    peekPublisherDetail: (id: number): IDeveloper | null =>
        peekCached<IDeveloper>(`/publishers/${id}`),
    getPublisherDetail: async (id: number, forceRefresh = false): Promise<IDeveloper> =>
        cachedGet<IDeveloper>(`/publishers/${id}`, {}, {
            forceRefresh,
            validate: value => matchesProfile(value, id),
        }),

}
