import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from '@env';
import { runtimeApiKey } from '../services/runtime-api-key';

const isDirectRawgApi = /https:\/\/api\.rawg\.io\/api\/?$/i.test(
    API_BASE_URL.trim(),
);


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    const key = runtimeApiKey.get();

    if (!key) {
        return Promise.reject(
            new Error('RAWG API key bulunamadı.'),
        );
    }

    config.params = {
        ...(config.params || {}),
        key,
    };

    return config;
});

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        const customError = {
            message: error.response?.data?.detail || error.response?.data?.message || error.message || 'Bilinmeyen bir hata oluştu',
            status: error.response?.status,
            data: error.response?.data,
        };

        return Promise.reject(customError);
    }
);

export default apiClient;
