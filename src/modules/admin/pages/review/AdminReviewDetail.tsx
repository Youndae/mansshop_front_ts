import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
	getReviewDetail,
	postReply
} from '@/modules/admin/services/adminReviewService';

import { getProductOption } from '@/common/utils/productOptionUtils';

import type { AxiosResponse } from 'axios';
import type { AdminReviewDetailType } from '@/modules/admin/types/AdminReviewType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import DefaultButton from '@/common/components/DefaultButton';

function AdminReviewDetail() {
	const { reviewId } = useParams();
	const [data, setData] = useState<AdminReviewDetailType>({
		productName: '',
        productOption: '',
        writer: '',
        createdAt: '',
        updatedAt: '',
        content: '',
        replyUpdatedAt: '',
        replyContent: '',
	});
	const [inputValue, setInputValue] = useState<string>('');

	const getDetail = async(): Promise<void> => {
		try {
			const res: AxiosResponse = await getReviewDetail(Number(reviewId));

			const responseContent = res.data;
			const option: string = getProductOption({
				size: responseContent.size,
				color: responseContent.color
			});

			setData({
				productName: responseContent.productName,
				productOption: option,
				writer: responseContent.writer,
				createdAt: responseContent.createdAt,
				updatedAt: responseContent.updatedAt,
				content: responseContent.content,
				replyUpdatedAt: responseContent.replyUpdatedAt,
				replyContent: responseContent.replyContent
			});
		} catch(err) {
			console.error('Failed to get review detail', err);
		}
	}

	useEffect(() => {
		getDetail();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reviewId]);

	//리뷰 답변 textarea 입력 이벤트
    const handleInputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setInputValue(e.target.value);
    }

	// 리뷰 답변 작성 submit 이벤트
	const handleInputSubmit = async(): Promise<void> => {
		if(inputValue === '')
			alert('답글 내용을 입력해주세요');
		else {
			try {
				await postReply(Number(reviewId), inputValue);

				setInputValue('');
				getDetail();
			} catch(err) {
				console.log(err);
			}
		}
	}

	return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'review'}
            />
            <div className="mypage-content">
                <div className="mypage-qna-header">
                    <h1>상품 리뷰</h1>
                </div>
                <div className="mypage-qna-content">
                    <div className="mypage-qna-content-title">
                        <h2>{data.productName}({data.productOption})</h2>
                        <small className="qna-reply-date">작성일 : {data.createdAt}, 수정일 : {data.updatedAt}</small>
                    </div>
                    <div className="mypage-qna-content-content">
                        <p className="qna-detail-content">
                            {data.content}
                        </p>
                    </div>
                    <div className="qna-reply-input">
                        <textarea className="reply-input-textarea" onChange={handleInputOnChange} value={inputValue}>{inputValue}</textarea>
                        <DefaultButton onClick={handleInputSubmit} btnText={'작성'}/>
                    </div>
                    <div className="mypage-qna-content-reply">
                        <AdminReviewReply data={data}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

type AdminReviewReplyProps = {
	data: AdminReviewDetailType;
}

function AdminReviewReply(props: AdminReviewReplyProps) {
    const { data } = props;

    if(!data.replyContent)
        return null;
    
	return (
		<div className="qna-detail-reply">
			<div className="qna-reply-writer">
				<strong>관리자</strong>
				<small className="qna-reply-date">{data.replyUpdatedAt}</small>
			</div>
			<div className="qna-reply-content">
				<p>{data.replyContent}</p>
			</div>
		</div>
	)
}

export default AdminReviewDetail;