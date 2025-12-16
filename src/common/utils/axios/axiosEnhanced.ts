import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { requestInterceptor, enhancedResponseInterceptor } from '@/common/utils/axios/axiosInterceptors';

//대부분의 요청에 사용되는 axios
export const axiosEnhanced = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
});

axiosEnhanced.interceptors.request.use(requestInterceptor as (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig);
axiosEnhanced.interceptors.response.use(
	(res: AxiosResponse) => res, enhancedResponseInterceptor
);