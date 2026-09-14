import { cachedGet } from '../request-cache';
import { IGenreResponse } from '../../types';

export const genreService = {
    getGenres: (): Promise<IGenreResponse> => cachedGet('/genres'),
};
