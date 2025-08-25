import {useEffect, useRef, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";

import { getAllOrderList } from '@/modules/admin/services/adminOrderService';

import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';
import { buildQueryString } from '@/common/utils/queryStringUtils';

import type { AxiosResponse } from 'axios';
import type { AdminOrderListType } from '@/modules/admin/types/AdminOrderType';
import type { PagingObjectType } from '@/common/types/paginationType';

import dayjs from 'dayjs';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import AdminOrderListForm from '@/modules/admin/components/AdminOrderListForm';
import AdminOrderModalDetail from '@/modules/admin/components/modal/AdminOrderModalDetail';

/*
        모든 주문 목록.
        최근 순으로 정렬.
        테이블 구조로 처리.
        recipient, userId, phone, createdAt 구조.

        하단에는 주문자, 아이디를 통한 검색과 페이징이 존재.
*/
function AdminAllOrderList() {
	const [params] = useSearchParams();
	const { page = '1', keyword, searchType = 'recipient' } = Object.fromEntries(params);

	const [data, setData] = useState<AdminOrderListType[]>([]);
	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        activeNo: Number(page),
	});
	const [keywordInput, setKeywordInput] = useState<string>('');
	const [modalOrderData, setModalOrderData] = useState<AdminOrderListType>({
		orderId: 0,
        recipient: '',
        userId: '',
        phone: '',
        createdAt: '',
        address: '',
        orderStatus: '',
        detailList: [],
	});
	const [keywordSelectValue, setKeywordSelectValue] = useState<string>('recipient');
	const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

	const modalRef = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
		setKeywordSelectValue(searchType);

		const getOrderList = async (): Promise<void> => {
			try {
				const res: AxiosResponse = await getAllOrderList(page, keyword, searchType);

				setData(res.data.content);

				const pagingObject = mainProductPagingObject(Number(page), res.data.totalPages);

                setPagingData({
                    startPage: pagingObject.startPage,
                    endPage: pagingObject.endPage,
                    prev: pagingObject.prev,
                    next: pagingObject.next,
                    activeNo: pagingObject.activeNo,
                });
			} catch (err) {
				console.error('Failed to get order list', err);
			}
		}

		getOrderList();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, keyword]);

	//주문 상세 modal창 오픈 이벤트
    const handleOnClick = (idx: number): void => {
        setModalOrderData(data[idx]);
        setModalIsOpen(true);
    }

    //검색 타입 select box 이벤트
    const handleSelectOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = e.target.value;

        setKeywordSelectValue(value);
    }

    //검색 input 입력 이벤트
    const handleKeywordOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setKeywordInput(e.target.value);
    }

    //주문 상세 modal창 close 이벤트
    const closeModal = (e: React.MouseEvent<HTMLDivElement>): void => {

        if(modalIsOpen && modalRef.current && !modalRef.current.contains(e.currentTarget)){
            setModalIsOpen(false);

            document.body.style.cssText = '';
        }
    }

	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
			searchType: keywordSelectValue,
			keyword: keywordInput,
		});
	}

	const handleSearchBtn = (): void => {
		if(keywordInput !== '') {
			const queryString = buildQueryString({
				type: keywordSelectValue,
				keyword: keywordInput,
			});
	
			navigate(`${queryString}`);	
		}else
			alert('검색어를 입력해주세요.');		
	}

    return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'order'}
            />
            <AdminOrderListForm
                header={'전체 주문 목록'}
                data={data}
                handleOnClick={handleOnClick}
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                modalRef={modalRef}
				keywordSelectValue={keywordSelectValue}
                handleSelectOnChange={handleSelectOnChange}
                handleKeywordOnChange={handleKeywordOnChange}
                keywordInput={keywordInput}
                pagingData={pagingData}
                handlePageBtn={handlePageBtn}
                handleSearchBtn={handleSearchBtn}
                render={() =>
                    <>
                        <div className="admin-order-info">
                            <div className="form-group">
                                <label>받는 사람 : </label>
                                <span>{modalOrderData.recipient}</span>
                            </div>
                            <div className="form-group">
                                <label>사용자 아이디 : </label>
                                <span>{modalOrderData.userId}</span>
                            </div>
                            <div className="form-group">
                                <label>연락처 : </label>
                                <span>{modalOrderData.phone}</span>
                            </div>
                            <div className="form-group">
                                <label>주문일 : </label>
                                <span>{dayjs(modalOrderData.createdAt).format('YYYY-MM-DD dd요일 HH:mm')}</span>
                            </div>
                            <div className="form-group">
                                <label>배송지 : </label>
                                <span>{modalOrderData.address}</span>
                            </div>
                            <div className="form-group">
                                <label>배송 상태 : </label>
                                <span>{modalOrderData.orderStatus}</span>
                            </div>
                        </div>
                        <div className="admin-order-detail">
                            {modalOrderData.detailList.map((data, index) => {
                                return (
                                    <AdminOrderModalDetail
                                        key={index}
                                        data={data}
                                        orderStatus={modalOrderData.orderStatus}
                                    />
                                )
                            })}
                        </div>
                    </>
                }
            />
        </div>
    )
}

export default AdminAllOrderList;