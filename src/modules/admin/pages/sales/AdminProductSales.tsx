import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";

import { getProductSalesList } from '@/modules/admin/services/adminSalesService';

import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';
import { numberComma } from '@/common/utils/formatNumberComma';
import { buildQueryString } from '@/common/utils/queryStringUtils';

import type { AxiosResponse } from 'axios';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { AdminProductSalesListType } from '../../types/AdminSalesType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import Pagination from '@/common/components/Pagination';

function AdminProductSales(){
	const [params] = useSearchParams();
	const { page = '1', keyword } = Object.fromEntries(params);

	const [data, setData] = useState<AdminProductSalesListType[]>([]);
    const [pagingData, setPagingData] = useState<PagingObjectType>({
        startPage: 0,
        endPage: 0,
        prev: false,
        next: false,
        activeNo: Number(page),
    });
    const [keywordInput, setKeywordInput] = useState<string>('');

    const navigate = useNavigate();

	useEffect(() => {
		const getList = async (): Promise<void> => {
			try {
				const res: AxiosResponse = await getProductSalesList(page, keyword);

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
				console.error('Failed to get product sales list', err);
			}
		}

		window.scrollTo(0, 0);
		if(keyword)
			setKeywordInput(keyword);

		getList();
	}, [page, keyword]);

	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
			keyword,
		});
	}

	//검색 input 입력 이벤트
    const handleKeywordOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setKeywordInput(e.target.value);
    }

	// 검색 submit 이벤트
	const handleSearchOnClick = (): void => {
		const queryString = buildQueryString({
			keyword: keywordInput,
		});
		navigate(`${queryString}`);
	}

	// 리스트 상품 Element 클릭 이벤트
	const handleProductOnClick = (productId: string): void => {
		navigate(`/admin/sales/product/${productId}`);
	}

	return (
        <div className="mypage">
            <AdminSideNav
                categoryStatus={'sales'}
            />
            <div className="admin-content">
                <div className="admin-content-header">
                    <h1>상품별 매출</h1>
                </div>
                <div className="admin-content-content">
                    <table className="admin-content-table">
                        <thead>
                            <tr>
                                <th>상품 분류</th>
                                <th>상품명</th>
                                <th>매출</th>
                                <th>판매량</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((product, index) => {
                                return (
                                    <tr key={index} onClick={() => handleProductOnClick(product.productId)} className="tr-pointer">
                                        <td>{product.classification}</td>
                                        <td>{product.productName}</td>
                                        <td>{numberComma(product.sales)}</td>
                                        <td>{numberComma(product.salesQuantity)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="admin-search">
                        <input type={'text'} onChange={handleKeywordOnChange} value={keywordInput}/>
                        <img alt={''} src={"https://as1.ftcdn.net/v2/jpg/03/25/73/68/1000_F_325736897_lyouuiCkWI59SZAPGPLZ5OWQjw2Gw4qY.jpg"} onClick={handleSearchOnClick}/>
                        <Pagination
                            pagingData={pagingData}
                            handlePageBtn={handlePageBtn}
                            className={'like-paging'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminProductSales;