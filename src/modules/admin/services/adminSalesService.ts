import { AdminSalesApi } from "@/modules/admin/api/adminSalesApi";
import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";

export const getYearSalesData = async (year: number): Promise<AxiosResponse> => 
	await AdminSalesApi.getYearSalesData(year);

export const getMonthSalesData = async (date: string): Promise<AxiosResponse> =>
	await AdminSalesApi.getMonthSalesData(date);

export const getMonthDailySalesData = async (date: string): Promise<AxiosResponse> =>{
	const queryString = buildQueryString({
		term: date,
	});

	return await AdminSalesApi.getMonthDailySalesData(queryString);
}

export const getMonthClassificationSalesData = async (date: string, classificationName: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({
		term: date,
		classification: classificationName,
	});

	return await AdminSalesApi.getMonthClassificationSalesData(queryString);
}

export const getDailyOrderList = async (date: string, page: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({
		term: date,
		page: page,
	});

	return await AdminSalesApi.getDailyOrderList(queryString);
}

export const getProductSalesList = async (page: string, keyword: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({
		page: page,
		keyword: keyword,
	});

	return await AdminSalesApi.getProductSalesList(queryString);
}

export const getProductSalesDetail = async (productId: string): Promise<AxiosResponse> => 
	await AdminSalesApi.getProductSalesDetail(productId);