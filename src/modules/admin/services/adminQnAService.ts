import { AdminQnAApi } from "@/modules/admin/api/adminQnAApi";
import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";
import type { QnAPatchReplyDataType, QnAPostReplyDataType } from "@/common/types/qnaType";

export const getProductQnAList = async (page: string, keyword: string, type: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({
		page,
		keyword,
		type,
	});

	return await AdminQnAApi.getProductQnAList(queryString);
}

export const getProductQnADetail = async (qnaId: number): Promise<AxiosResponse> => 
	await AdminQnAApi.getProductQnADetail(qnaId);

export const patchProductQnAReply = async (replyId: number, replyContent: string): Promise<AxiosResponse> => {
	const body: QnAPatchReplyDataType = {
		replyId: replyId,
		content: replyContent,
	}

	return await AdminQnAApi.patchProductQnAReply(body);
}

export const postProductQnAReply = async (qnaId: number, replyContent: string): Promise<AxiosResponse> => {
	const body: QnAPostReplyDataType = {
		qnaId: qnaId,
		content: replyContent,
	}

	return await AdminQnAApi.postProductQnAReply(body);
}

export const patchProductQnAComplete = async (qnaId: number): Promise<AxiosResponse> => 
	await AdminQnAApi.patchProductQnAComplete(qnaId);

export const getMemberQnAList = async (page: string, keyword: string, type: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({
		page,
		keyword,
		type,
	});

	return await AdminQnAApi.getMemberQnAList(queryString);
}

export const getMemberQnADetail = async (qnaId: number): Promise<AxiosResponse> => 
	await AdminQnAApi.getMemberQnADetail(qnaId);

export const patchMemberQnAReply = async (replyId: number, replyContent: string): Promise<AxiosResponse> => {
	const body: QnAPatchReplyDataType = {
		replyId: replyId,
		content: replyContent,
	}

	return await AdminQnAApi.patchMemberQnAReply(body);
}

export const postMemberQnAReply = async (qnaId: number, replyContent: string): Promise<AxiosResponse> => {
	const body: QnAPostReplyDataType = {
		qnaId: qnaId,
		content: replyContent,
	}

	return await AdminQnAApi.postMemberQnAReply(body);
}

export const patchMemberQnAComplete = async (qnaId: number): Promise<AxiosResponse> => 
	await AdminQnAApi.patchMemberQnAComplete(qnaId);

export const getQnAClassificationList = async (): Promise<AxiosResponse> =>
	await AdminQnAApi.getQnAClassificationList();

export const postQnAClassification = async (classificationName: string): Promise<AxiosResponse> =>{
	const body: string = JSON.stringify(classificationName);

	return await AdminQnAApi.postQnAClassification(body);
}
	

export const deleteQnAClassification = async (classificationName: string): Promise<AxiosResponse> =>
	await AdminQnAApi.deleteQnAClassification(classificationName);