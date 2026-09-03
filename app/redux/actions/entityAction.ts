import { entityService } from "@services";
import { ICreatorResponse, IDeveloperResponse } from "@types";
import { createAppAsyncThunk } from "@utils";

export const getCreatorsProcess = createAppAsyncThunk<ICreatorResponse, { page: number }>(
    'entity/getCreatorsProcess',
    ({ page }) => entityService.getCreators(page)
);
export const getCreatorDetailProcess = createAppAsyncThunk<ICreatorResponse, number>(
    'entity/getCreatorDetailProcess',
    (id) => entityService.getCreatorDetail(id)
);
export const getDevelopersProcess = createAppAsyncThunk<IDeveloperResponse, { page: number }>(
    'entity/getDevelopersProcess',
    ({ page }) => entityService.getDevelopers(page)
);
export const getDeveloperDetailProcess = createAppAsyncThunk<IDeveloperResponse, number>(
    'entity/getDeveloperDetailProcess',
    (id) => entityService.getDeveloperDetail(id)
);
export const getPublishersProcess = createAppAsyncThunk<IDeveloperResponse, { page: number }>(
    'entity/getDeveloperDetailProcess',
    ({ page }) => entityService.getPublishers(page)
);
export const getPublisherDetailProcess = createAppAsyncThunk<IDeveloperResponse, number>(
    'entity/getPublisherDetailProcess',
    (id) => entityService.getPublisherDetail(id)
);

