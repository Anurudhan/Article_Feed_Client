import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export interface CustomResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config; // Rely on cookies, no manual token handling
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse<CustomResponse> => {
    const customData: CustomResponse = {
      data: response.data?.data ?? {},
      message: response.data?.message ?? 'Request successful',
      success: true,
    };
    return { ...response, data: customData };
  },
  (error) => {
    const customError: CustomResponse = {
      data: {},
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong',
      success: false,
    };
    return Promise.reject({ ...error, response: { ...error.response, data: customError } });
  }
);

export default axiosInstance;