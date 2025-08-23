import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

const BASE_URL = 'api/my-page/';

export const MyPageNotificationApi = {
	getNotificationList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}notification${queryString}`),
}