import { MyPageOrderApi } from "@/modules/mypage/api/mypageOrderApi";

import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";

export const getOrderList = async(term: string, page: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({ page });

	return await MyPageOrderApi.getOrderList(term, queryString);
}