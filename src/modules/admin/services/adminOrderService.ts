import { AdminOrderApi } from "@/modules/admin/api/adminOrderApi";
import { buildQueryString } from "@/common/utils/queryStringUtils";
import { validateSearchType } from "@/common/utils/paginationUtils";

import type { AxiosResponse } from "axios";

export const getNewOrderList = async (page: string, keyword: string, searchType: string): Promise<AxiosResponse> => {
	const searchTypeValue = validateSearchType({keyword, searchType});
	const queryString: string = buildQueryString({
		page,
		keyword,
		searchType: searchTypeValue,
	});
	
	return await AdminOrderApi.getNewOrderList(queryString);
}

export const patchOrderStatus = async (orderId: number): Promise<AxiosResponse> =>
	await AdminOrderApi.patchOrderStatus(orderId);

export const getAllOrderList = async (page: string, keyword: string, searchType: string): Promise<AxiosResponse> => {
	const searchTypeValue = validateSearchType({keyword, searchType});
	const queryString: string = buildQueryString({
		page,
		keyword,
		searchType: searchTypeValue,
	});

	return await AdminOrderApi.getAllOrderList(queryString);
}