import { ITagResponse } from '@types';
import { IPlatformResponse } from '../../types/platform';
import { IStoreResponse } from '../../types/store';
import { cachedGet } from '../request-cache';

export const discoveryService = {
    getPlatforms: (page: number = 1): Promise<IPlatformResponse> =>
        cachedGet('/platforms', { page }),
    getPlatfomrDetail: (id: number): Promise<IPlatformResponse> =>
        cachedGet(`/platforms/${id}`),
    getStores: (page: number = 1): Promise<IStoreResponse> =>
        cachedGet('/stores', { page }),
    getTags: ({ page = 1, pageSize = 40 }): Promise<ITagResponse> =>
        cachedGet('/tags', { page, page_size: pageSize }),
    getTagDetail: (id: number): Promise<ITagResponse> =>
        cachedGet(`/tags/${id}`),
};
