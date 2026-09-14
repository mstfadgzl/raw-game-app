import { createAppAsyncThunk } from '@utils';
import type { IPlatformResponse } from '../../types/platform';
import type { ITagResponse } from '@types';
import { discoveryService } from '@services';

export const getPlatformsProcess = createAppAsyncThunk<IPlatformResponse, { page: number }>(
    'discovery/getPlatformsProcess', ({ page }) => discoveryService.getPlatforms(page),
);
export const getTagsProcess = createAppAsyncThunk<ITagResponse, { page: number; pageSize?: number }>(
    'discovery/getTagsProcess', params => discoveryService.getTags(params),
);
