
import apiClient from "../client";
import { IGenreResponse } from "../../types";

export const genreService = {
    getGenres: async (): Promise<IGenreResponse> => {
        const response = await apiClient.get<IGenreResponse>('/genres');
        return response.data;
    },
};