import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
	getMemberQnADetail,
	deleteMemberQnA,
	modifyReply,
	postReply
} from '@/modules/mypage/services/mypageQnAService';
import { toggleReplyInputStatus } from '@/common/utils/qnaUtils';

import type { AxiosResponse } from 'axios';
import type { QnAData, QnAReplyData } from '@/common/types/qnaType';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import QnADetail from '@/common/components/QnADetail';

function MyPageMemberQnADetail() {
	const { qnaId } = useParams();

	const [data, setData] = useState<QnAData>({
		qnAId: 0,
		title: '',
		writer: '',
		qnaContent: '',
		date: '',
		qnaStatus: false,
	});
	const [replyData, setReplyData] = useState<QnAReplyData[]>([]);
	const [modifyTextValue, setModifyTextValue] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>('');

	const navigate = useNavigate();

	const getMemberQnA = async(): Promise<void> => {
		try {
			const res: AxiosResponse = await getMemberQnADetail(Number(qnaId));

			setData({
				qnAId: res.data.memberQnAId,
				title: `[${res.data.qnaClassification}] ${res.data.qnaTitle}`,
				writer: res.data.writer,
				qnaContent: res.data.qnaContent,
				date: res.data.updatedAt,
				qnaStatus: res.data.memberQnAStat
			});

			const replyArr: QnAReplyData[] = res.data.replyList.map((reply: QnAReplyData) => ({
																		replyId: reply.replyId,
																		writer: reply.writer,
																		replyContent: reply.replyContent,
																		updatedAt: reply.updatedAt,
																		inputStatus: false,
																	}));

			setReplyData(replyArr);
		}catch(err) {
			console.error('member qna detail get error', err);
		}
	}

	useEffect(() => {
		getMemberQnA();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qnaId]);

	// 문의 삭제 버튼 이벤트
	const handleDeleteBtn = async(): Promise<void> => {
		try {
			await deleteMemberQnA(Number(qnaId));

			navigate('/my-page/qna/member');
		} catch(err) {
			console.log(err);
		}
	}

	//답변 수정 및 닫기 버튼 이벤트
	//답변 수정 Element Open, Close 제어
	const handleReplyModifyElement = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const idx = Number(e.currentTarget.value);
		toggleReplyInputStatus(replyData, idx, setReplyData, setModifyTextValue);
	}

	//답변 수정 textarea 입력 이벤트
	const handleModifyOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		setModifyTextValue(e.target.value);
	}

	//답변 수정 submit 이벤트
	const handleModifySubmit = async(e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		const idx = Number(e.currentTarget.value);
		const replyId = replyData[idx].replyId;

		try {
			await modifyReply(replyId, modifyTextValue);

			getMemberQnA();
		} catch(err) {
			console.log(err);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
		}
	}

	//답변 작성 input 입력 이벤트
	const handleInputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		setInputValue(e.target.value);
	}

	//답변 작성 입력 submit 이벤트
	const handleInputSubmit = async(): Promise<void> => {
		try {
			await postReply(data.qnAId, inputValue);

			setInputValue('');
			getMemberQnA();
		} catch(err) {
			console.log(err);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
		}
	}

	return (
        <div className="mypage">
            <MyPageSideNav
                qnaStat={true}
            />
            <QnADetail
                data={data}
                replyData={replyData}
                handleReplyModifyElement={handleReplyModifyElement}
                handleModifyOnChange={handleModifyOnChange}
                modifyTextValue={modifyTextValue}
                handleModifySubmit={handleModifySubmit}
                handleInputOnChange={handleInputOnChange}
                inputValue={inputValue}
                handleInputSubmit={handleInputSubmit}
                titleText={'문의 사항'}
                type={'member'}
                handleDeleteBtn={handleDeleteBtn}
            />
        </div>
    )
}

export default MyPageMemberQnADetail;