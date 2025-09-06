import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { postReview } from '@/modules/mypage/services/mypageReviewService';

import type { OrderReviewWriteStateType } from '@/common/types/reviewType';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import MyPageReviewWriteForm from '@/modules/mypage/components/MyPageReviewWriteForm';

//리뷰 작성
function MyPageReviewWrite() {
	const location = useLocation();
	const state: OrderReviewWriteStateType | undefined = location.state;

	const [productName, setProductName] = useState<string>('');
	const [inputData, setInputData] = useState<string>('');

	const navigate = useNavigate();

	useEffect(() => {
		if(state) {
			setProductName(state.productName);
		}else {
			alert('오류가 발생했습니다.\n문제가 계속된다면 관리자에게 문의해주세요.');
			navigate('/');
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);

	//내용 input 입력 이벤트
	const handleInputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		setInputData(e.target.value);
	}

	//리뷰 작성 요청 이벤트
	const handleSubmit = async(): Promise<void> => {
		try {
			await postReview(state as OrderReviewWriteStateType, inputData);

			navigate('/my-page/review');
		} catch (error) {
			console.log(error);
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

export default MyPageReviewWrite;