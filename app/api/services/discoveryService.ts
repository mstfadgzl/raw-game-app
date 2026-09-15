import { ITagResponse } from '@types';
import { IPlatformResponse } from '../../types/platform';
import { cachedGet } from '../request-cache';

export const discoveryService = {
    getPlatforms: (page: number = 1): Promise<IPlatformResponse> =>
        cachedGet('/platforms', { page }),
    getTags: ({ page = 1, pageSize = 40 }): Promise<ITagResponse> =>
        cachedGet('/tags', { page, page_size: pageSize }),
};
