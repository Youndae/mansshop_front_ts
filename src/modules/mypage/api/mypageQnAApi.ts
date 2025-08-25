import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { QnAPatchReplyDataType, QnAPostReplyDataType } from "@/common/types/qnaType";
import type { MyPagePatchMemberQnADataType, MyPagePostMemberQnADataType } from "@/modules/mypage/types/mypageQnAType";

const BASE_URL = 'my-page/qna';

export const MyPageQnAApi = {
	getMemberQnAList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/member${queryString}`),
	getProductQnAList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/product${queryString}`),
	getProductQnADetail: (qnaId: number) =>
		axiosEnhanced.get(`${BASE_URL}/product/detail/${qnaId}`),
	deleteProductQnA: (qnaId: number) =>
		axiosEnhanced.delete(`${BASE_URL}/product/${qnaId}`),
	getMemberQnADetail: (qnaId: number) =>
		axiosEnhanced.get(`${BASE_URL}/member/detail/${qnaId}`),
	deleteMemberQnA: (qnaId: number) =>
		axiosEnhanced.delete(`${BASE_URL}/member/${qnaId}`),
	modifyReply: (body: QnAPatchReplyDataType) =>
		axiosEnhanced.patch(`${BASE_URL}/member/reply`, body),
	postReply: (body: QnAPostReplyDataType) =>
		axiosEnhanced.post(`${BASE_URL}/member/reply`, body),
	getMemberQnAPatchData: (qnaId: number) =>
		axiosEnhanced.get(`${BASE_URL}/member/modify/${qnaId}`),
	patchMemberQnA: (body: MyPagePatchMemberQnADataType) =>
		axiosEnhanced.patch(`${BASE_URL}/member`, body),
	getQnAClassificationList: () =>
		axiosEnhanced.get(`${BASE_URL}/classification`),
	postMemberQnA: (body: MyPagePostMemberQnADataType) =>
		axiosEnhanced.post(`${BASE_URL}/member`, body)
}