import { MyPageReviewApi } from "@/modules/mypage/api/mypageReviewApi";

import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";
import type { MyPagePostReviewDataType, MyPagePatchReviewDataType } from "@/modules/mypage/types/mypageReviewType";
import type { OrderReviewWriteStateType } from "@/common/types/reviewType";


export const getReviewList = async(page: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({ page });

	return await MyPageReviewApi.getReviewList(queryString);
}

export const deleteReview = async (reviewId: number): Promise<AxiosResponse> => 
	await MyPageReviewApi.deleteReview(reviewId);

export const getPatchReviewData = async (reviewId: number): Promise<AxiosResponse> => 
	await MyPageReviewApi.getPatchReviewData(reviewId);

export const patchReview = async (reviewId: number, inputData: string): Promise<AxiosResponse> => {
	const body: MyPagePatchReviewDataType = {
		reviewId: reviewId,
		content: inputData,
	}

	return await MyPageReviewApi.patchReview(body);
}

export const postReview = async (state: OrderReviewWriteStateType, inputData: string): Promise<AxiosResponse> => {
	const body: MyPagePostReviewDataType = {
		productId: state.productId,
		content: inputData,
		optionId: state.optionId,
		detailId: state.detailId,
	}

	return await MyPageReviewApi.postReview(body);
}
	