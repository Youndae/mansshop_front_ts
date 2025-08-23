import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import {
	getQnAClassificationList,
	postMemberQnA
} from '@/modules/mypage/services/mypageQnAService';

import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';
import type { AxiosResponse } from 'axios';
import type { MyPageMemberQnAInputType } from '@/modules/mypage/types/mypageQnAType';
import type { MyPageMemberQnAClassificationType } from '@/modules/mypage/types/mypageQnAType';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import MyPageMemberQnAWriteForm from '@/modules/mypage/components/MyPageMemberQnAWriteForm';



//회원 문의 작성 페이지
function MyPageMemberQnAWrite() {
	const [inputData, setInputData] = useState<MyPageMemberQnAInputType>({
		title: '',
		content: '',
	});
	const [classification, setClassification] = useState<MyPageMemberQnAClassificationType[]>([]);
	const [classificationId, setClassificationId] = useState<number>(0);
	
	const navigate = useNavigate();

	useEffect(() => {
		const getClassification = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getQnAClassificationList();

				setClassification(res.data.classificationList);
                setClassificationId(res.data.classificationList[0].id);
			} catch(err) {
				console.error('member qna write get error', err);
			}
		}

		getClassification();
	}, []);

	// 작성 이벤트
	const handleSubmit = async(): Promise<void> => {
		try {
			const res = await postMemberQnA(inputData, classificationId);

			if(res.data.message === RESPONSE_MESSAGE.OK)
				navigate(`/my-page/qna/member/detail/${res.data.memberQnAId}`);
		} catch(err) {
			console.log(err);
		}
	}

	//문의 분류 select box 이벤트
	const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		setClassificationId(Number(e.target.value));
	}

	//제목 및 textarea 입력 이벤트
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
                    btnText={'작성'}
                />
            </div>
        </div>
	)
}

export default MyPageMemberQnAWrite;