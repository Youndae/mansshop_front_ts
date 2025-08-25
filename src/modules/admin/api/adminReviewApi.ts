import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { AdminReviewPostReplyType } from "@/modules/admin/types/AdminReviewType";

const BASE_URL = 'admin/review';

export const AdminReviewApi = {
	getNewReviewList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}${queryString}`),
	getAllReviewList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/all${queryString}`),
	getReviewDetail: (reviewId: number) =>
		axiosEnhanced.get(`${BASE_URL}/detail/${reviewId}`),
	postReply: (body: AdminReviewPostReplyType) =>
		axiosEnhanced.post(`${BASE_URL}/reply`, body)
}