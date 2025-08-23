import { MyPageQnAApi } from "@/modules/mypage/api/mypageQnAApi";

import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";
import type { MyPagePatchMemberQnADataType, MyPagePostMemberQnADataType, MyPageMemberQnAInputType } from "@/modules/mypage/types/mypageQnAType";
import type { QnAPatchReplyDataType, QnAPostReplyDataType } from "@/common/types/qnaType";


export const getMemberQnAList = async(page: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({ page });

	return await MyPageQnAApi.getMemberQnAList(queryString);
}

export const getProductQnAList = async(page: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({ page });

	return await MyPageQnAApi.getProductQnAList(queryString);
}

export const getProductQnADetail = async(qnaId: number): Promise<AxiosResponse> => 
	await MyPageQnAApi.getProductQnADetail(qnaId);

export const deleteProductQnA = async(qnaId: number): Promise<AxiosResponse> => 
	await MyPageQnAApi.deleteProductQnA(qnaId);

export const getMemberQnADetail = async(qnaId: number): Promise<AxiosResponse> => 
	await MyPageQnAApi.getMemberQnADetail(qnaId);

export const deleteMemberQnA = async(qnaId: number): Promise<AxiosResponse> => 
	await MyPageQnAApi.deleteMemberQnA(qnaId);

export const modifyReply = async(replyId: number, replyContent: string): Promise<AxiosResponse> => {
	const body: QnAPatchReplyDataType = {
		replyId: replyId,
		content: replyContent
	}

	return await MyPageQnAApi.modifyReply(body);
}

export const postReply = async (memberQnAId: number, replyContent: string): Promise<AxiosResponse> => {
	const body: QnAPostReplyDataType = {
		qnaId: memberQnAId,
		content: replyContent
	}

	return await MyPageQnAApi.postReply(body);
}

export const getMemberQnAPatchData = async (qnaId: number): Promise<AxiosResponse> =>
	await MyPageQnAApi.getMemberQnAPatchData(qnaId);

export const patchMemberQnA = async (qnaId: number, inputData: MyPageMemberQnAInputType, classificationId: number): Promise<AxiosResponse> => {
	const body: MyPagePatchMemberQnADataType = {
		qnaId: qnaId,
		title: inputData.title,
		content: inputData.content,
		classificationId: classificationId
	}

	return await MyPageQnAApi.patchMemberQnA(body);
}

export const getQnAClassificationList = async (): Promise<AxiosResponse> =>
	await MyPageQnAApi.getQnAClassificationList();

export const postMemberQnA = async (inputData: MyPageMemberQnAInputType, classificationId: number): Promise<AxiosResponse> => {
	const body: MyPagePostMemberQnADataType = {
		title: inputData.title,
		content: inputData.content,
		classificationId: classificationId
	}

	return await MyPageQnAApi.postMemberQnA(body);
}