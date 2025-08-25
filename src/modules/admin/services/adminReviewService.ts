import { AdminReviewApi } from "@/modules/admin/api/adminReviewApi";
import { buildQueryString } from "@/common/utils/queryStringUtils";
import { validateSearchType } from "@/common/utils/paginationUtils";

import type { AxiosResponse } from "axios";
import type { AdminReviewPostReplyType } from "@/modules/admin/types/AdminReviewType";

export const getNewReviewList = async (page: string, keyword: string, searchType: string): Promise<AxiosResponse> => {
	const searchTypeValue = validateSearchType({keyword, searchType});
	const queryString = buildQueryString({
		page,
		keyword,
		searchType: searchTypeValue,
	});

	return await AdminReviewApi.getNewReviewList(queryString);
}

export const getAllReviewList = async (page: string, keyword: string, searchType: string): Promise<AxiosResponse> => {
	const searchTypeValue = validateSearchType({keyword, searchType});
	const queryString = buildQueryString({
		page,
		keyword,
		searchType: searchTypeValue,
	});

	return await AdminReviewApi.getAllReviewList(queryString);
}

export const getReviewDetail = async (reviewId: number): Promise<AxiosResponse> => 
	await AdminReviewApi.getReviewDetail(reviewId);

export const postReply = async (reviewId: number, replyContent: string): Promise<AxiosResponse> => {
	const body: AdminReviewPostReplyType = {
		reviewId: reviewId,
		content: replyContent,
	}

	return await AdminReviewApi.postReply(body);
}