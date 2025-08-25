export type MyPagePatchMemberQnADataType = {
	qnaId: number;
	title: string;
	content: string;
	classificationId: number;
}

export type MyPagePostMemberQnADataType = {
	title: string;
	content: string;
	classificationId: number;
}

export type MyPageMemberQnAInputType = {
	title: string;
	content: string;
}

export type MyPageMemberQnADataType = {
	memberQnAId: number;
	memberQnATitle: string;
	memberQnAStat: boolean;
	qnaClassification: string;
	updatedAt: string;
}

export type MyPageProductQnADataType = {
	productQnAId: number;
	productName: string;
	productQnAStat: boolean;
	createdAt: string;
}