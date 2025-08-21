import type { AxiosResponse } from 'axios';

const AUTH_KEY = 'Authorization';

export const getToken = (): string | null => localStorage.getItem(AUTH_KEY);

export const setToken = (token: string | null | undefined): void => {
	if(typeof token === 'string' && token.length > 0)
		localStorage.setItem(AUTH_KEY, token);
};

export const setTokenFromAxios = (res: AxiosResponse): void => {
	const token = res.headers?.['authorization'];
	setToken(token);
};

export const removeToken = (): void => localStorage.removeItem(AUTH_KEY);