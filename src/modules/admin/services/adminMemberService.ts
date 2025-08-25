import { AdminMemberApi } from "@/modules/admin/api/adminMemberApi";
import { buildQueryString } from "@/common/utils/queryStringUtils";
import { validateSearchType } from "@/common/utils/paginationUtils";


import type { AxiosResponse } from "axios";
import type { AdminMemberPostPointType } from "@/modules/admin/types/AdminMemberType";

export const getMemberList = async (page: string, keyword: string, searchType: string): Promise<AxiosResponse> => {
	const searchTypeValue = validateSearchType({keyword, searchType});
	const queryString = buildQueryString({
		page,
		keyword,
		searchType: searchTypeValue,
	});

	return await AdminMemberApi.getMemberList(queryString);
}

export const postPoint = async (userId: string, point: number): Promise<AxiosResponse> => {
	const body: AdminMemberPostPointType = {
		userId: userId,
		point: point,
	}

	return await AdminMemberApi.postPoint(body);
}