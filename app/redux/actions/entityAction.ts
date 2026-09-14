import { entityService } from '@services';
import type { ICreatorResponse, IDeveloperResponse } from '@types';
import { createAppAsyncThunk } from '@utils';

export const getCreatorsProcess = createAppAsyncThunk<ICreatorResponse, { page?: number; pageSize: number }>(
    'entity/getCreatorsProcess', params => entityService.getCreators(params),
);
export const getDevelopersProcess = createAppAsyncThunk<IDeveloperResponse, { page: number }>(
    'entity/getDevelopersProcess', ({ page }) => entityService.getDevelopers(page),
);
