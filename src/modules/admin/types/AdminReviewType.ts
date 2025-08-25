export type AdminReviewListType = {
	reviewId: number;
	productName: string;
	writer: string;
	updatedAt: string;
	status: boolean;
}

export type AdminReviewPostReplyType = {
	reviewId: number;
	content: string;
}

export type AdminReviewDetailType = {
	productName: string;
	productOption: string;
	writer: string;
	createdAt: string;
	updatedAt: string;
	content: string;
	replyUpdatedAt: string;
	replyContent: string;
}