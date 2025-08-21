import { getToken, setTokenFromAxios, removeToken } from '@/common/utils/axios/tokenUtils';
import { getReIssueToken } from "@/common/services/authService";
import { axiosEnhanced } from '@/common/utils/axios/axiosEnhanced';

import type { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';

type RetryableAxiosConfig = AxiosRequestConfig & { _retry?: boolean };

//공통 Request Interceptor
export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
	const token: string | null = getToken();
	if(token){
		config.headers['Authorization'] = token;
	}

	return config;
}

// 401에 대한 처리만 하는 Interceptor
export const simpleResponseInterceptor = async (error: AxiosError): Promise<never> => {
	if(error.response?.status === 401) {
		const cfg = error.config as RetryableAxiosConfig;
		cfg._retry = true;

		try {
			const res: AxiosResponse = await getReIssueToken();

			if(res.data?.message === RESPONSE_MESSAGE.OK) {
				setTokenFromAxios(res);
				if(cfg.headers)
					cfg.headers['Authorization'] = getToken() ?? '';
				return axiosEnhanced(cfg);
			}
		}catch(err: unknown) {
			console.error('Token Reissue failed : ', err);
		}
	}

	return Promise.reject(error);
};

// 401, 403, 800에 대한 처리만 하는 Interceptor
export const enhancedResponseInterceptor = async (error: AxiosError): Promise<AxiosError> => {
	const status: number = error.response?.status ?? 0;
	const message: string = (error.response?.data as { errorMessage?: string } | undefined)?.errorMessage ?? '';

	if(status === 800) {
		removeToken();
		alert('로그인 정보에 문제가 발생해 로그아웃됩니다.\n문제가 계속된다면 관리자에게 문제해주세요.');
        window.location.href = '/';
	}else if(status === 403 || message === 'AccessDeniedException') {
		window.location.href ='/error';
	}else {
		return simpleResponseInterceptor(error);
	}

	return Promise.reject(error);
}