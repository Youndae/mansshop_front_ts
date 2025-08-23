import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getOrderList } from '@/modules/mypage/services/mypageOrderService';
import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';

import type { PagingObjectType } from '@/common/types/paginationType';
import type { OrderDataType } from '@/common/types/orderDataType';
import type { AxiosResponse } from 'axios';

import MyPageSideNav from '@/modules/mypage/components/MyPageSideNav';
import OrderListForm from '@/common/components/OrderListForm';

import '@/styles/mypage.css';

/*
    주문 목록 조회
    select box를 통한 기간별 조회 가능.
    3, 6, 12 개월, 전체 조회 가능.
*/
function MyPageOrder() {
	const [params] = useSearchParams();
	const { page = '1', term = 3 } = Object.fromEntries(params);
	const [orderData, setOrderData] = useState<OrderDataType[]>([]);
	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
		endPage: 0,
		prev: false,
		next: false,
		activeNo: Number(page),
	});

	const userType: string = 'user';

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);

		const getOrderData = async(term: string): Promise<void> => {
			try {
				const res: AxiosResponse = await getOrderList(term, page);

				const pagingObject: PagingObjectType = mainProductPagingObject(Number(page), res.data.totalPages);

				setPagingData({
                    startPage: pagingObject.startPage,
                    endPage: pagingObject.endPage,
                    prev: pagingObject.prev,
                    next: pagingObject.next,
                    activeNo: pagingObject.activeNo,
                });

                setOrderData(res.data.content);
			}catch (err) {
				console.error('getOrderData error', err);
			}
		}

		getOrderData(String(term));
	}, [term, page]);

	//페이지네이션 버튼 이벤트
	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
			term: String(term),
		});
	}

	//기간 select box 이벤트
	const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const selectTerm = e.currentTarget.value;

		navigate(`?term=${selectTerm}`);
	}

	return (
        <div className="mypage">
            <MyPageSideNav
                qnaStat={false}
            />
            <OrderListForm
                className={'mypage-content'}
                orderData={orderData}
                pagingData={pagingData}
                term={String(term)}
                userType={userType}
                handleSelectOnChange={handleSelectOnChange}
                handlePageBtn={handlePageBtn}
            />
        </div>
    )
}

export default MyPageOrder;