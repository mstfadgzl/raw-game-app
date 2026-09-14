import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL, RAWG_API_KEY } from '@env';

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

// Doğrudan RAWG bağlantısında anahtar her isteğe eklenir. Proxy kullanılırsa
// anahtar istemciden gönderilmez; proxy anahtarı sunucu tarafında ekler.
apiClient.interceptors.request.use(config => {
    if (isDirectRawgApi && RAWG_API_KEY?.trim()) {
        config.params = {
            ...(config.params || {}),
            key: RAWG_API_KEY.trim(),
        };
    }

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
