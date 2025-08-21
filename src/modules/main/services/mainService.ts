import { buildQueryString } from '@/common/utils/queryStringUtils';
import { MainApi } from '@/modules/main/api/mainApi';

import type { AxiosResponse } from 'axios';

export const getBestProductList = async (): Promise<AxiosResponse> =>
	await MainApi.getBestProductList();

export const getNewProductList = async (): Promise<AxiosResponse> =>
	await MainApi.getNewProductList();

export const getClassificationList = async (classification: string, page: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({ page });

	return await MainApi.getClassificationList(classification, queryString);
}

export const getOrderList = async (page: string, term: string, recipient: string, phone: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({ page });

	return await MainApi.getOrderList(queryString, term, recipient, phone);
}

export const getSearchProductList = async (page: string, keyword?: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({ page, keyword });

	return await MainApi.getSearchProductList(queryString);
}