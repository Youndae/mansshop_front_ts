import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { 
	getPatchReviewData, 
	patchReview 
} from '@/modules/mypage/services/mypageReviewService';

import { RESPONSE_MESSAGE } from '@/common/constants/responseMessageType';

import type { AxiosResponse } from 'axios';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import MyPageReviewWriteForm from '@/modules/mypage/components/MyPageReviewWriteForm';

//리뷰 수정
function MyPageReviewModify() {
	const { reviewId } = useParams();

	const [inputData, setInputData] = useState<string>('');
	const [productName, setProductName] = useState<string>('');

	const navigate = useNavigate();

	useEffect(() => {
		const getReviewData = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getPatchReviewData(Number(reviewId));

				setInputData(res.data.content);
				setProductName(res.data.productName);
			}catch (err) {
				console.error('review modify get error', err);
			}
		}

		getReviewData();
	}, [reviewId]);

	//input 입력 이벤트
	const handleInputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		setInputData(e.target.value);
	}

	//리뷰 수정 요청 이벤트
	const handleSubmit = async(): Promise<void> => {
		try {
			const res: AxiosResponse = await patchReview(Number(reviewId), inputData);

			if(res.data.message === RESPONSE_MESSAGE.OK)
				navigate('/my-page/review');
		} catch (err) {
			console.error('review modify error', err);
		}
	}
	
	return (
		<div className="mypage">
            <MyPageSideNav qnaStat={false}/>
            <div className="mypage-content">
                <div className="mypage-qna-header">
                    <h1>리뷰 수정</h1>
                </div>
                <MyPageReviewWriteForm
                    productName={productName}
                    inputData={inputData}
                    handleInputOnChange={handleInputOnChange}
                    handleSubmit={handleSubmit}
                />
            </div>
        </div>
	)
}

export default MyPageReviewModify;