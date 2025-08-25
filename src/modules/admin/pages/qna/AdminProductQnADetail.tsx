import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

import {
	getProductQnADetail,
	patchProductQnAReply,
	postProductQnAReply,
	patchProductQnAComplete
} from '@/modules/admin/services/adminQnAService';

import {toggleReplyInputStatus} from '@/common/utils/qnaUtils';

import {RESPONSE_MESSAGE} from '@/common/constants/responseMessageType';

import type {AxiosResponse} from 'axios';
import type {QnAData, QnAReplyData} from '@/common/types/qnaType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import QnADetail from '@/common/components/QnADetail';

/*
	상품 문의 상세 페이지.

	내용 하단에서 답변 작성 가능.
	오른쪽 상단의 답변 완료 버튼을 통해 답변을 작성하지 않고 완료 처리 가능.
*/
function AdminProductQnADetail() {
	const { qnaId } = useParams();
	const [data, setData] = useState<QnAData>({
		qnAId: 0,
		title: '',
		writer: '',
		qnaContent: '',
		date: '',
		qnaStatus: false
	});
	const [replyData, setReplyData] = useState<QnAReplyData[]>([]);
	const [modifyTextValue, setModifyTextValue] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>('');

	const getDetail = async (): Promise<void> => {
		try {
			const res: AxiosResponse = await getProductQnADetail(Number(qnaId));

			setData({
				qnAId: res.data.productQnAId,
				title: `상품명 : ${res.data.productName}`,
				writer: res.data.writer,
				qnaContent: res.data.qnaContent,
				date: res.data.createdAt,
				qnaStatus: res.data.productQnAStat
			});

			const replyArr: QnAReplyData[] = [];
			const replyList = res.data.replyList;

			for(let i = 0; i < replyList.length; i++) {
				replyArr.push({
					replyId: replyList[i].replyId,
					writer: replyList[i].writer,
					replyContent: replyList[i].replyContent,
					updatedAt: replyList[i].updatedAt,
					inputStatus: false,
				});
			}

			setReplyData(replyArr);
		} catch(err) {
			console.error('Failed to get product qna detail', err);
		}
	}

	useEffect(() => {
		getDetail();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qnaId]);

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
	const handleModifySubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		const idx = Number(e.currentTarget.value);
		const replyId = replyData[idx].replyId;

		try {
			const res = await patchProductQnAReply(replyId, modifyTextValue);

			if(res.data.message === RESPONSE_MESSAGE.OK) 
				getDetail();
		} catch(err) {
			console.error('Failed to patch product qna reply', err);
		}
	}
	
	//답변 작성 textarea 입력 이벤트
    const handleInputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setInputValue(e.target.value);
    }

	//답변 작성 submit 이벤트
	const handleInputSubmit = async (): Promise<void> => {
		try {
			const res = await postProductQnAReply(Number(qnaId), inputValue);

			if(res.data.message === RESPONSE_MESSAGE.OK) 
				getDetail();
		} catch(err) {
			console.error('Failed to post product qna reply', err);
		}
	}

	// 답변 완료 버튼 이벤트
	const handleCompleteBtn = async (): Promise<void> => {
		try {
			const res = await patchProductQnAComplete(Number(qnaId));

			if(res.data.message === RESPONSE_MESSAGE.OK) 
				getDetail();
		} catch(err) {
			console.error('Failed to complete product qna', err);
		}
	}

	return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'qna'}
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
                titleText={'상품 문의'}
				type={'product'}
                handleCompleteBtn={handleCompleteBtn}
            />
        </div>
    )
}

export default AdminProductQnADetail;