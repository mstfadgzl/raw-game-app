import apiClient from "@services/client";
import { IScreenshotResponse } from "../../types";

export const screenshotService = {
    getGameScreenshots: async (gameId: number): Promise<IScreenshotResponse> => {
        const response = await apiClient.get<IScreenshotResponse>(`/games/${gameId}/screenshots`);
        return response.data;
    },
};