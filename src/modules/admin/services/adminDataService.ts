import { AdminDataApi } from "@/modules/admin/api/adminDataApi";

import type { AdminFailedDataType } from "@/modules/admin/types/AdminFailedDataType";
import type { AxiosResponse } from "axios";

export const getFailedQueueList = async (): Promise<AxiosResponse> =>
	await AdminDataApi.getFailedQueueList();

export const retryDLQMessages = async (data: AdminFailedDataType[]): Promise<AxiosResponse> =>
	await AdminDataApi.retryDLQMessages(data);

export const getFailedOrderDataList = async (): Promise<AxiosResponse> =>
	await AdminDataApi.getFailedOrderDataList();

export const postRetryOrderData = async (): Promise<AxiosResponse> =>
	await AdminDataApi.postRetryOrderData();