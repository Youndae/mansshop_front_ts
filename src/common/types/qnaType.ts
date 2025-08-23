export type QnAReplyData = {
	replyId: number;
	writer: string;
	replyContent: string;
	updatedAt: string;
	inputStatus: boolean;
}

export type QnAData = {
	qnAId: number;
	title: string;
	writer: string;
	qnaContent: string;
	date: string;
	qnaStatus: boolean;
}

export type QnAPatchReplyDataType = {
	replyId: number;
	content: string;
}

export type QnAPostReplyDataType = {
	qnaId: number;
	content: string;
}