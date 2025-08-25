import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { QnAPatchReplyDataType, QnAPostReplyDataType } from "@/common/types/qnaType";

const BASE_URL = 'admin/qna';

export const AdminQnAApi = {
	getProductQnAList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/product${queryString}`),
	getProductQnADetail: (qnaId: number) =>
		axiosEnhanced.get(`${BASE_URL}/product/${qnaId}`),
	patchProductQnAReply: (body: QnAPatchReplyDataType) =>
		axiosEnhanced.patch(`${BASE_URL}/product/reply`, body),
	postProductQnAReply: (body: QnAPostReplyDataType) =>
		axiosEnhanced.post(`${BASE_URL}/product/reply`, body),
	patchProductQnAComplete: (qnaId: number) =>
		axiosEnhanced.patch(`${BASE_URL}/product/${qnaId}`),
	getMemberQnAList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/member${queryString}`),
	getMemberQnADetail: (qnaId: number) =>
		axiosEnhanced.get(`${BASE_URL}/member/${qnaId}`),
	patchMemberQnAReply: (body: QnAPatchReplyDataType) =>
		axiosEnhanced.patch(`${BASE_URL}/member/reply`, body),
	postMemberQnAReply: (body: QnAPostReplyDataType) =>
		axiosEnhanced.post(`${BASE_URL}/member/reply`, body),
	patchMemberQnAComplete: (qnaId: number) =>
		axiosEnhanced.patch(`${BASE_URL}/member/${qnaId}`),
	getQnAClassificationList: () =>
		axiosEnhanced.get(`${BASE_URL}/classification`),
	postQnAClassification: (body: string) =>
		axiosEnhanced.post(`${BASE_URL}/classification`, body),
	deleteQnAClassification: (classificationName: string) =>
		axiosEnhanced.delete(`${BASE_URL}/classification/${classificationName}`)
}