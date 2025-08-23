export type MyPageReviewType = {
	reviewId: number;
	thumbnail: string;
	productName: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	replyContent: string;
	replyUpdatedAt: string;
}

export type MyPagePatchReviewDataType = {
	reviewId: number;
	content: string;
}

export type MyPagePostReviewDataType = {
	productId: string;
	content: string;
	optionId: number;
	detailId: number;
}