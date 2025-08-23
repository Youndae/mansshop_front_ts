import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
	getMemberQnAPatchData,
	patchMemberQnA
} from '@/modules/mypage/services/mypageQnAService';

import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';
import type { AxiosResponse } from 'axios';
import type { MyPageMemberQnAInputType } from '@/modules/mypage/types/mypageQnAType';
import type { MyPageMemberQnAClassificationType } from '@/modules/mypage/types/mypageQnAType';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import MyPageMemberQnAWriteForm from '@/modules/mypage/components/MyPageMemberQnAWriteForm';

//문의 수정 페이지
function MyPageMemberQnAModify() {
	const { qnaId } = useParams();
	const [inputData, setInputData] = useState<MyPageMemberQnAInputType>({
		title: '',
		content: '',
	});
	const [classification, setClassification] = useState<MyPageMemberQnAClassificationType[]>([]);
	const [classificationId, setClassificationId] = useState<number>(0);


	const navigate = useNavigate();

	useEffect(() => {
		const getPatchData = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getMemberQnAPatchData(Number(qnaId));

				setInputData({
					title: res.data.qnaTitle,
					content: res.data.qnaContent
				});

				setClassificationId(res.data.qnaClassificationId);
                setClassification(res.data.classificationList);
			} catch(err) {
				console.error('member qna modify get error', err);
			}
		}

		getPatchData();

	}, [qnaId]);

	//문의 수정 이벤트
	const handleSubmit = async(): Promise<void> => {
		try {
			const res = await patchMemberQnA(Number(qnaId), inputData, classificationId);

			if(res.data.message === RESPONSE_MESSAGE.OK)
				navigate(`/my-page/qna/member/detail/${qnaId}`);
		} catch(err) {
			console.log(err);
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
		}
	}

	//문의 분류 select box 이벤트
	const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		setClassificationId(Number(e.target.value));
	}

	//제목, textarea 입력 이벤트
	const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		setInputData({
			...inputData,
			[e.target.name]: e.target.value
		});
	}
	
	return (
        <div className="mypage">
            <MyPageSideNav
                qnaStat={true}
            />
            <div className="mypage-content">
                <div className="mypage-qna-header">
                    <h1>문의하기</h1>
                </div>
                <MyPageMemberQnAWriteForm
                    inputData={inputData}
                    classificationId={classificationId}
                    classification={classification}
                    handleInputOnChange={handleInputOnChange}
                    handleSelectOnChange={handleSelectOnChange}
                    handleSubmit={handleSubmit}
                    btnText={'수정'}
                />
            </div>
        </div>
    )
}

export default MyPageMemberQnAModify;