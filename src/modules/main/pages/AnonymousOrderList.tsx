import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getOrderList } from '@/modules/main/services/mainService';
import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { getClickPageNumber } from '@/common/utils/paginationUtils';
import type { RootState } from '@/common/types/userDataType';
import type { OrderDataType } from '@/common/types/orderDataType';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { AxiosResponse } from 'axios';

import OrderListForm from '@/common/components/OrderListForm';

import '@/styles/mypage.css';

/*
    비회원의 주문 목록 페이지
    회원이 접근하는 경우 mypage의 주문 목록 페이지로 강제 이동
 */
function AnonymousOrderList() {
	const loginStatus = useSelector((state: RootState) => state.member.loginStatus);
	const [params] = useSearchParams();
	const { page = '1', term = '3' } = Object.fromEntries(params);

	const location = useLocation();
	const state: { recipient: string, phone: string } = location.state as { recipient: string, phone: string };

	const [orderData, setOrderData] = useState<OrderDataType[]>([]);
	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
		endPage: 0,
		prev: false,
		next: false,
		activeNo: Number(page),
	});

	const userType: string = 'none';
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);

		const getOrderData = async (): Promise<void> => {
			try {
				const res: AxiosResponse = await getOrderList(page, term, state.recipient, state.phone);

				setOrderData(res.data.content);

				const pagingData = mainProductPagingObject(Number(page), res.data.totalPages);
				setPagingData({
					startPage: pagingData.startPage,
					endPage: pagingData.endPage,
					prev: pagingData.prev,
					next: pagingData.next,
					activeNo: pagingData.activeNo,
				});
			}catch (err) {
				console.error('order list error : ', err);
			}
		}

		if(loginStatus) 
			navigate('/my-page/order');
		else
			getOrderData();
	}, [term, page]);

	// 기간 select box 이벤트
	const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const { value } = e.target;
		navigate(
			`/order/detail?term=${value}`,
			{
				state: {
					recipient: state.recipient,
					phone: state.phone,
				}
			}
		);
	}

	// 페이지 버튼 이벤트
	const handlePageBtn = (type: string): void => {
		const onClickPage = getClickPageNumber(type, pagingData);
		navigate(
			`/order/detail?term=${term}&page=${onClickPage}`,
			{
				state: { recipient: state.recipient, phone: state.phone}
			}
		);
	}

	return (
		<div className="non-member-order">
            <OrderListForm
                className={'non-member-order-content'}
                orderData={orderData}
                pagingData={pagingData}
                term={term}
                userType={userType}
                handleSelectOnChange={handleSelectOnChange}
                handlePageBtn={handlePageBtn}
            />
        </div>
	)

}

export default AnonymousOrderList;