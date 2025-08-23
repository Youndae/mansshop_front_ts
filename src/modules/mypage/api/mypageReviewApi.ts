import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { MyPagePatchReviewDataType, MyPagePostReviewDataType } from "@/modules/mypage/types/mypageReviewType";

const BASE_URL = 'api/my-page/review/';

export const MyPageReviewApi = {
	getReviewList: async (queryString: string) => 
		axiosEnhanced.get(`${BASE_URL}${queryString}`),
	deleteReview: async (reviewId: number) => 
		axiosEnhanced.delete(`${BASE_URL}${reviewId}`),
	getPatchReviewData: async (reviewId: number) => 
		axiosEnhanced.get(`${BASE_URL}modify/${reviewId}`),
	patchReview: async (body: MyPagePatchReviewDataType) => 
		axiosEnhanced.patch(`${BASE_URL}`, body),
	postReview: async (body: MyPagePostReviewDataType) => 
		axiosEnhanced.post(`${BASE_URL}`, body)
}