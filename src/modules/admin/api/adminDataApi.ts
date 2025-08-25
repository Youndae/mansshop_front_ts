import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { AdminFailedDataType } from "@/modules/admin/types/AdminFailedDataType";

const BASE_URL = 'admin/message';

export const AdminDataApi = {
	getFailedQueueList: () =>
		axiosEnhanced.get(`${BASE_URL}`),
	retryDLQMessages: (data: AdminFailedDataType[]) =>
		axiosEnhanced.post(`${BASE_URL}`, data),
	getFailedOrderDataList: () =>
		axiosEnhanced.get(`${BASE_URL}/order`),
	postRetryOrderData: () =>
		axiosEnhanced.post(`${BASE_URL}/order`),
}