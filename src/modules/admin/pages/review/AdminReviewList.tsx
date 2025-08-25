import {useState, useEffect} from 'react';
import {useLocation, useSearchParams, useNavigate} from "react-router-dom";

import {
	getNewReviewList,
	getAllReviewList
} from '@/modules/admin/services/adminReviewService';

import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';
import { buildQueryString } from '@/common/utils/queryStringUtils';

import type { AxiosResponse } from 'axios';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { AdminReviewListType } from '@/modules/admin/types/AdminReviewType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import AdminReviewListForm from '@/modules/admin/components/AdminReviewListForm';

/*
    리뷰 목록 페이지
    useLocation을 통해
    /admin/review 인 경우 미처리 리뷰 목록
    /admin/review/all인 경우 전체 리뷰 목록 조회.

    여기는 미처리와 전체 select box 선택은 없고 sideNav 버튼에 따라 변경.

    검색은 사용자 아이디 또는 닉네임 기반 조회와 상품명 기반 조회.
    select box를 통해 선택해서 조회.
    상품명과 작성자로만 나오는데 작성자 기반 조회는 아이디 및 닉네임으로 조회 처리.
*/
function AdminReviewList(){
	const location = useLocation();
	const [params] = useSearchParams();
	const { page = '1', searchType = 'user', keyword } = Object.fromEntries(params);

	const [data, setData] = useState<AdminReviewListType[]>([]);
	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        activeNo: Number(page),
	});
	const [keywordInput, setKeywordInput] = useState<string>('');
	const [keywordSelectValue, setKeywordSelectValue] = useState<string>('');
	const [contentHeader, setContentHeader] = useState<string>('');

	const navigate = useNavigate();

	const setResponseData = (res: AxiosResponse): void => {
		setData(res.data.content);

		const pagingObject = mainProductPagingObject(Number(page), res.data.totalPages);

		setPagingData({
			startPage: pagingObject.startPage,
			endPage: pagingObject.endPage,
			prev: pagingObject.prev,
			next: pagingObject.next,
			activeNo: pagingObject.activeNo,
		});
	}

	useEffect(() => {
		const getNewList = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getNewReviewList(page, keyword, searchType);

				setResponseData(res);
			} catch(err) {
				console.error('Failed to get new review list', err);
			}
		}

		const getAllList = async(): Promise<void> => {
			try {
				const res: AxiosResponse = await getAllReviewList(page, keyword, searchType);

				setResponseData(res);
			} catch(err) {
				console.error('Failed to get all review list', err);
			}
		}

		window.scrollTo(0, 0);
		setKeywordSelectValue(searchType);

		//useLocation 값에 따라 url Prefix 및 목록 header 정의
        const urlPrefix = location.pathname.substring(1);
        if(urlPrefix === 'admin/review'){
            setContentHeader('미답변 리뷰');
			getNewList();
		}else{
            setContentHeader('전체 리뷰');
			getAllList();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location, page, keyword]);

	//검색 select box 이벤트
    const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = e.target.value;
        setKeywordSelectValue(value);
    }

    //검색 input 입력 이벤트
    const handleKeywordOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setKeywordInput(e.target.value);
    }

    //리뷰 목록 Element 클릭 이벤트
    //리뷰 상세페이지 이동
    const handleOnClick = (reviewId: number): void => {
        navigate(`/admin/review/detail/${reviewId}`);
	}

	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
			keyword: keywordInput,
			searchType: keywordSelectValue,
		})
	}

	const handleSearchOnClick = (): void => {
		const queryString = buildQueryString({
			keyword: keywordInput,
			searchType: keywordSelectValue,
		});

		navigate(`${queryString}`);
	}

    return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'review'}
            />
            <AdminReviewListForm
                header={contentHeader}
                data={data}
                handleOnClick={handleOnClick}
                keywordSelectValue={keywordSelectValue}
                handleSelectOnChange={handleSelectOnChange}
                handleKeywordOnChange={handleKeywordOnChange}
                keywordInput={keywordInput}
                pagingData={pagingData}
				handlePageBtn={handlePageBtn}
				handleSearchOnClick={handleSearchOnClick}
            />
        </div>
    )
}

export default AdminReviewList;