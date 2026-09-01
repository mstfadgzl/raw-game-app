import Config from "react-native-config";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { RAWG_API_KEY, RAWG_BASE_URL } from '@env';


const apiClient = axios.create({
    baseURL: RAWG_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        config.params = {
            ...config.params,
            key: RAWG_API_KEY,
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('API Error Status:', error.response.status);
            console.error('API Error Data:', error.response.data);
        } else if (error.request) {
            console.error('Network Error: Sunucuya ulaşılamadı');
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);