import { entityService } from "@services";
import { ICreator, ICreatorResponse, IDeveloper, IDeveloperResponse } from "@types";
import { createAppAsyncThunk } from "@utils";

export const getCreatorsProcess = createAppAsyncThunk<ICreatorResponse, { page?: number, pageSize: number }>(
    'entity/getCreatorsProcess',
    params => entityService.getCreators(params)
);
export const getCreatorDetailProcess = createAppAsyncThunk<ICreator, number>(
    'entity/getCreatorDetailProcess',
    (id) => entityService.getCreatorDetail(id)
);
export const getDevelopersProcess = createAppAsyncThunk<IDeveloperResponse, { page: number }>(
    'entity/getDevelopersProcess',
    ({ page }) => entityService.getDevelopers(page)
);
export const getDeveloperDetailProcess = createAppAsyncThunk<IDeveloper, number>(
    'entity/getDeveloperDetailProcess',
    (id) => entityService.getDeveloperDetail(id)
);
export const getPublishersProcess = createAppAsyncThunk<IDeveloperResponse, { page: number }>(
    'entity/getPublishersProcess',
    ({ page }) => entityService.getPublishers(page)
);
export const getPublisherDetailProcess = createAppAsyncThunk<IDeveloperResponse, number>(
    'entity/getPublisherDetailProcess',
    (id) => entityService.getPublisherDetail(id)
);

