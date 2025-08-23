import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
	getProductQnADetail,
	deleteProductQnA
} from '@/modules/mypage/services/mypageQnAService';

import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';
import type { AxiosResponse } from 'axios';
import type { QnAData, QnAReplyData } from '@/common/types/qnaType';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import QnADetail from '@/common/components/QnADetail';


/*
    상품 문의 상세 페이지
    사용자는 답변 작성 불가.

    단순히 작성한 문의 내용을 보여주고 삭제만 가능.
*/
function MyPageProductQnADetail() {
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

	const navigate = useNavigate();

	useEffect(() => {
		const getProductQnA = async(): Promise<void> => {
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

				const replyArr: QnAReplyData[] = res.data.replyList.map((reply: QnAReplyData) => ({
					replyId: reply.replyId,
					writer: reply.writer,
					replyContent: reply.replyContent,
					updatedAt: reply.updatedAt,
					inputStatus: false,
				}));

				setReplyData(replyArr);
			} catch(err) {
				console.error('getProductQnA error', err);
			}
		}

		getProductQnA();
	}, [qnaId]);

	//문의 삭제 버튼 이벤트
	const handleDeleteBtn = async(): Promise<void> => {
		try {
			const res = await deleteProductQnA(Number(qnaId));

			if(res.data.message === RESPONSE_MESSAGE.OK) 
				navigate('/my-page/qna/product');
			
		} catch(err) {
			console.error('handleDeleteBtn error', err);
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
                handleReplyModifyElement={undefined}
                handleModifyOnChange={undefined}
                modifyTextValue={''}
                handleModifySubmit={undefined}
                handleInputOnChange={undefined}
                inputValue={''}
                handleInputSubmit={undefined}
                titleText={'상품 문의'}
				type={'product'}
                handleDeleteBtn={handleDeleteBtn}
                replyStatus={false}
            />
       </div>			
	)
}


export default MyPageProductQnADetail;