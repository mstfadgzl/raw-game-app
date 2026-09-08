import { createAppAsyncThunk } from "@utils";
import { IPlatformResponse } from "../../types/platform";
import { discoveryService } from "@services";
import { IStoreResponse } from "../../types/store";
import { ITagResponse } from "@types";

export const getPlatformsProcess = createAppAsyncThunk<IPlatformResponse, { page: number }>(
    'discovery/getPlatformsProcess',
    ({ page }) => discoveryService.getPlatforms(page)
);
export const getPlatfomrDetailProcess = createAppAsyncThunk<IPlatformResponse, number>(
    'discovery/getPlatfomrDetailProcess',
    (id) => discoveryService.getPlatfomrDetail(id)
);
export const getStoresProcess = createAppAsyncThunk<IStoreResponse, { page: number }>(
    'discovery/getStoresProcess',
    ({ page }) => discoveryService.getStores(page)
);
export const getTagsProcess = createAppAsyncThunk<ITagResponse, { page: number; pageSize?: number }>(
    'discovery/getTagsProcess',
    params => discoveryService.getTags(params)
);
export const getTagDetailProcess = createAppAsyncThunk<ITagResponse, number>(
    'discovery/getTagDetailProcess',
    (id) => discoveryService.getTagDetail(id)
);