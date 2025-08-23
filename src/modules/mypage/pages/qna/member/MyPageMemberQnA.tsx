import {useEffect, useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getMemberQnAList } from '@/modules/mypage/services/mypageQnAService';
import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';

import type { AxiosResponse } from 'axios';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { MyPageMemberQnADataType } from '@/modules/mypage/types/mypageQnAType';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import Pagination from '@/common/components/Pagination';
import DefaultButton from '@/common/components/DefaultButton';
import MyPageQnABody from '@/modules/mypage/components/MyPageQnABody';

/*
    회원 문의 목록
    회원 문의 작성은 여기에서 가능
 */
function MemberQnA() {
	const [params] = useSearchParams();
	const { page = '1' } = Object.fromEntries(params);

	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        activeNo: Number(page),
	});
	const [qnaData, setQnAData] = useState<MyPageMemberQnADataType[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);

		const getMemberQnA = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getMemberQnAList(page);
				
				setQnAData(res.data.content);

				const pagingObject: PagingObjectType = mainProductPagingObject(Number(page), res.data.totalPages);
				setPagingData({
                    startPage: pagingObject.startPage,
                    endPage: pagingObject.endPage,
                    prev: pagingObject.prev,
                    next: pagingObject.next,
                    activeNo: pagingObject.activeNo,
                });
			}catch(err) {
				console.error('member qna list get error', err);
			}
		}

		getMemberQnA();
	}, [page]);

	// 페이지네이션 버튼 이벤트
	const handlePageBtn = (type: string) => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
		});
	}

	// 문의 작성 페이지 이동 버튼 이벤트
	const handleInsertBtn = () => {
		navigate('/my-page/qna/member/write');
	}

	return (
        <div className="mypage">
            <MyPageSideNav
                qnaStat={true}
            />
            <div className="mypage-content">
                <div className="mypage-qna-header">
                    <h1>문의 사항</h1>
                    <div className="mypage-qna-header-btn">
                        <DefaultButton onClick={handleInsertBtn} btnText={'문의하기'}/>
                    </div>
                </div>
                <div className="mypage-qna-content">
                    <table className="qna-table">
                        <thead>
                            <tr>
                                <th>분류</th>
                                <th>제목</th>
                                <th>답변 상태</th>
                                <th>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                        {qnaData.map((data, index) => {
                            return (
								<MyPageQnABody
									key={index}
									type={'MEMBER'}
									qnaClassification={data.qnaClassification}
									qnaStatus={data.memberQnAStat}
									qnaTitle={data.memberQnATitle}
									qnaDate={data.updatedAt}
									qnaId={data.memberQnAId}
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

export default MemberQnA;