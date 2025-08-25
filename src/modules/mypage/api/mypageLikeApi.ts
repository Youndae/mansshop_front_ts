import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

const BASE_URL = 'my-page';

export const MyPageLikeApi = {
	getLikeProductList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/like${queryString}`),
}