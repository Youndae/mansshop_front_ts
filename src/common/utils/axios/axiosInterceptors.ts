import { getToken, setTokenFromAxios, removeToken } from '@/common/utils/axios/tokenUtils';
import { getReIssueToken } from "@/common/services/authService";
import { axiosEnhanced } from '@/common/utils/axios/axiosEnhanced';

import type { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';
import {parseStatusAndMessage} from "@/common/utils/responseErrorUtils.ts";

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
export const simpleResponseInterceptor = async (error: AxiosError): Promise<AxiosError> => {
	const { status, message } = parseStatusAndMessage(error);

	if(status === 401 && message === RESPONSE_MESSAGE.TOKEN_EXPIRED) {
		const cfg = error.config as RetryableAxiosConfig;
		cfg._retry = true;

		try {
			const res: AxiosResponse = await getReIssueToken();

			setTokenFromAxios(res);
			if(cfg.headers)
				cfg.headers['Authorization'] = getToken() ?? '';
			return axiosEnhanced(cfg);
		}catch(err: unknown) {
			console.error('Token Reissue failed : ', err);
			removeToken();
			alert('로그인 정보에 문제가 발생해 로그아웃됩니다.\n문제가 계속된다면 관리자에게 문제해주세요.');
			window.location.href='/';
		}
	}

	return Promise.reject(error);
};

// 401, 403, 800에 대한 처리만 하는 Interceptor
export const enhancedResponseInterceptor = async (error: AxiosError): Promise<AxiosError> => {
	const { status, message } = parseStatusAndMessage(error);

	if(status === 401 && (message === RESPONSE_MESSAGE.TOKEN_STEALING || message === RESPONSE_MESSAGE.TOKEN_INVALID)) {
		removeToken();
		alert('로그인 정보에 문제가 발생해 로그아웃됩니다.\n문제가 계속된다면 관리자에게 문제해주세요.');
        window.location.href = '/';
	}else if(status === 403 || message === RESPONSE_MESSAGE.FORBIDDEN) {
		window.location.href ='/error';
	}else {
		return simpleResponseInterceptor(error);
	}

	return Promise.reject(error);
}