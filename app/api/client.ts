import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from '@env';



const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
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
