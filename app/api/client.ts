import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { RAWG_API_KEY, RAWG_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const apiClient = axios.create({
    baseURL: RAWG_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        config.params = {
            ...config.params,
            key: RAWG_API_KEY,
        };
        const token = await AsyncStorage.getItem('@TOKEN');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.warn('Oturum süresi doldu, kullanıcı çıkışa yönlendiriliyor...');
            await AsyncStorage.removeItem('@TOKEN');
            // store.dispatch(logout());
        }
        const customError = {
            message: error.response?.data?.detail || error.message || 'Bilinmeyen bir hata oluştu',
            status: error.response?.status,
            data: error.response?.data,
        };

        return Promise.reject(customError);
    }
);

export default apiClient;