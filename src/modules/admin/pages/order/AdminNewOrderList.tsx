import {useEffect, useRef, useState} from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";

import {
	getNewOrderList,
	patchOrderStatus
} from '@/modules/admin/services/adminOrderService';

import { numberComma } from '@/common/utils/formatNumberComma';
import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';
import { buildQueryString } from '@/common/utils/queryStringUtils';

import type { AxiosResponse } from 'axios';
import type { AdminOrderListType } from '@/modules/admin/types/AdminOrderType';
import type { PagingObjectWithTotalType } from '@/common/types/paginationType';

import dayjs from 'dayjs';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import DefaultButton from '@/common/components/DefaultButton';
import AdminOrderListForm from '@/modules/admin/components/AdminOrderListForm';
import AdminOrderModalDetail from '@/modules/admin/components/modal/AdminOrderModalDetail';

function AdminNewOrderList() {
	const [ params ] = useSearchParams();
	const { page = '1', keyword, searchType = 'recipient' } = Object.fromEntries([...params]);

	const [data, setData] = useState<AdminOrderListType[]>([]);
	const [pagingData, setPagingData] = useState<PagingObjectWithTotalType>({
		startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        totalElements: 0,
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

	const getOrderList = async (): Promise<void> => {
		try {
			const res: AxiosResponse = await getNewOrderList(page, keyword, searchType);

			setData(res.data.content);

			const pagingObject = mainProductPagingObject(Number(page), res.data.totalPages);

			setPagingData({
				startPage: pagingObject.startPage,
				endPage: pagingObject.endPage,
				prev: pagingObject.prev,
				next: pagingObject.next,
				totalElements: res.data.totalElements,
				activeNo: pagingObject.activeNo,
			});
		} catch (err) {
			console.error('Failed to get order list', err);
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
		setKeywordSelectValue(searchType);
		getOrderList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, keyword]);

	//리스트 Element 클릭 이벤트
    //주문 정보 modal Open
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

    //주문 정보 modal close
    const closeModal = (e: React.MouseEvent<HTMLDivElement>): void => {
        if(modalIsOpen && modalRef.current && !modalRef.current.contains(e.currentTarget)){
            setModalIsOpen(false);

            document.body.style.cssText = '';
        }
    }

	// 주문 정보 Model 내부 상품 준비 버튼 이벤트
	const handlePreparationBtn = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
		e.preventDefault();

		try {
			await patchOrderStatus(Number(e.currentTarget.value));

			setModalIsOpen(false);
			document.body.style.cssText = '';

			getOrderList();
		} catch(err) {
			console.log(err);
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
                header={`미처리 주문 목록 (${numberComma(pagingData.totalElements)} 건)`}
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
                        <div className="admin-order-detail-check-btn">
                            <DefaultButton
                                btnText={'상품 준비'}
                                onClick={handlePreparationBtn}
                                className={'order-preparation-btn'}
                                value={modalOrderData.orderId}
                            />
                        </div>
                    </>
                }
            />
        </div>
    )
}

export default AdminNewOrderList;