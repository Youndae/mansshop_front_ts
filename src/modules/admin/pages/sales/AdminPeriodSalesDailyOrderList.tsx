import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { getDailyOrderList } from '@/modules/admin/services/adminSalesService';

import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';
import { numberComma } from '@/common/utils/formatNumberComma';

import type { AxiosResponse } from 'axios';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { AdminDailyOrderListType } from '@/modules/admin/types/AdminSalesType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import Pagination from '@/common/components/Pagination';

/*
    일 주문 내역

    당일의 주문내역만을 출력한다.
*/
function AdminPeriodSalesDailyOrderList(){
	const { selectDate } = useParams();
	const [params] = useSearchParams();
	const { page = '1' } = Object.fromEntries(params);

	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        activeNo: Number(page),
	});
	const [data, setData] = useState<AdminDailyOrderListType[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		const getList = async(): Promise<void> => {
			if(!selectDate) return;
			try {
				const res: AxiosResponse = await getDailyOrderList(selectDate, page);

				setData(res.data.content);

				const pagingObject = mainProductPagingObject(Number(page), res.data.totalPages);

                setPagingData({
                    startPage: pagingObject.startPage,
                    endPage: pagingObject.endPage,
                    prev: pagingObject.prev,
                    next: pagingObject.next,
                    activeNo: pagingObject.activeNo,
                });
			} catch(err) {
				console.error('Failed to get daily order list', err);
			}
		}

		getList();
	}, [selectDate, page]);
	
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
            <AdminSideNav
                categoryStatus={'sales'}
            />
            <div className="admin-content">
                <div className="admin-content-header">
                    <h1>{selectDate?.replaceAll('-', ' / ')} 주문 내역</h1>
                </div>
                <div className="admin-content-content">
                    {data.map((orderData, index) => {
                        return (
                            <div key={index} className="admin-period-order-content">
                                {orderData.detailList.map((detail, index) => {
                                    const sizeText = `사이즈 : ${detail.size}`;
                                    const colorText = `컬러 : ${detail.color}`;
                                    let optionText = '';
                                    if(detail.size === null){
                                        if(detail.color !== null) {
                                            optionText = colorText;
                                        }
                                    }else {
                                        if(detail.color !== null) {
                                            optionText = `${sizeText}, ${colorText}`;
                                        }else {
                                            optionText = sizeText;
                                        }
                                    }
                                    return (
                                        <div key={index} className="form-group">
                                            <label>{detail.productName}</label>
                                            <p>{`${optionText}, 수량 : ${detail.count}, 금액 : ${numberComma(detail.price)}`}</p>
                                        </div>
                                    )
                                })}
                                <p className="admin-period-order-content-total">{`결제 금액 : ${numberComma(orderData.totalPrice)}, 배송비 : ${numberComma(orderData.deliveryFee)}, 결제 방식 : ${orderData.paymentType}`}</p>
                            </div>
                        )
                    })}
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

export default AdminPeriodSalesDailyOrderList;