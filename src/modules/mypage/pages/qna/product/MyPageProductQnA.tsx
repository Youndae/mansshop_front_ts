import {useEffect, useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getProductQnAList } from '@/modules/mypage/services/mypageQnAService';
import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';

import type { AxiosResponse } from 'axios';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { MyPageProductQnADataType } from '@/modules/mypage/types/mypageQnAType';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import Pagination from '@/common/components/Pagination';
import MyPageQnABody from '@/modules/mypage/components/MyPageQnABody';

//상품 문의 목록
function MyPageProductQnA() {
	const [params] = useSearchParams();
	const { page = '1' } = Object.fromEntries(params);

	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        activeNo: Number(page),
	});
	const [qnaData, setQnAData] = useState<MyPageProductQnADataType[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);

		const getProductQnA = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getProductQnAList(page);

				setQnAData(res.data.content);

				const pagingObject = mainProductPagingObject(Number(page), res.data.totalPages);

                setPagingData({
                    startPage: pagingObject.startPage,
                    endPage: pagingObject.endPage,
                    prev: pagingObject.prev,
                    next: pagingObject.next,
                    activeNo: pagingObject.activeNo,
                });
			} catch(err) {
				console.error('product qna get error', err);
			}
		}

		getProductQnA();
	}, [page]);

	// 페이지네이션 버튼 이벤트
	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
		});
	}

	return (
        <div className="mypage">
            <MyPageSideNav
                qnaStat={true}
            />
            <div className="mypage-content">
                <div className="mypage-qna-header">
                    <h1>상품 문의</h1>
                </div>
                <div className="mypage-qna-content">
                    <table className="qna-table">
                        <thead>
                            <tr>
                                <th>상품명</th>
                                <th>답변 상태</th>
                                <th>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qnaData.map((data, index) => {
                                return (
									<MyPageQnABody
										key={index}
										type={'PRODUCT'}
										qnaClassification={''}
										qnaStatus={data.productQnAStat}
										qnaTitle={data.productName}
										qnaDate={data.createdAt}
										qnaId={data.productQnAId}
									/>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    pagingData={pagingData}
                    handlePageBtn={handlePageBtn}
                    className={'like-paging'}
                />
            </div>
        </div>
    )	
}

export default MyPageProductQnA;