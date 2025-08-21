import type { QnAReplyData } from "@/common/types/qnaType";

// TODO: QnAReplyType 타입 확실한 정의 필요
export function toggleReplyInputStatus(
	replyData: QnAReplyData[],
	index: number, 
	setReplyData: (data: QnAReplyData[]) => void, 
	setModifyTextValue: (value: string) => void
): void {
	const currentData = replyData[index];
	const newData = {
		...currentData,
		inputStatus: !currentData.inputStatus,
	};

	const newReplyData = [...replyData];
	newReplyData[index] = newData;

	setReplyData(newReplyData);
	if(!currentData.inputStatus) {
		setModifyTextValue(currentData.replyContent);
	}
}