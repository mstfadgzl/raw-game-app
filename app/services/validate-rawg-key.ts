import axios from 'axios';
import { API_BASE_URL } from '@env';

export const validateRawgKey = async (
    key: string,
): Promise<boolean> => {
    const cleanKey = key.trim();

    if (!cleanKey) {
        return false;
    }

    try {
        await axios.get('/games', {
            baseURL: API_BASE_URL,
            params: {
                key: cleanKey,
                page_size: 1,
            },
            timeout: 10000,
        });

        return true;
    } catch {
        return false;
    }
};
