import { MyPageNotificationApi } from "@/modules/mypage/api/mypageNotificationApi";

import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";

export const getNotificationList = async(page: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({ page });

	return await MyPageNotificationApi.getNotificationList(queryString);
}