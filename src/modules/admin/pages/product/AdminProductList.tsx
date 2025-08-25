import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { getProductList } from '@/modules/admin/services/adminProductService';

import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';
import { buildQueryString } from '@/common/utils/queryStringUtils';
import { numberComma } from '@/common/utils/formatNumberComma';

import type { AxiosResponse } from 'axios';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { AdminProductListType } from '@/modules/admin/types/AdminProductType';

import AdminSideNav from '@/modules/admin/components/AdminSideNav';
import Pagination from '@/common/components/Pagination';
import DefaultButton from '@/common/components/DefaultButton';

import '@/styles/admin.css';

function AdminProductList() {
	const [params] = useSearchParams();
	const { page = '1', keyword } = Object.fromEntries(params);

	const [data, setData] = useState<AdminProductListType[]>([]);
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
				const res: AxiosResponse = await getProductList(page, keyword);

				setData(res.data.content);

				const pagingData = mainProductPagingObject(Number(page), res.data.totalPages);
                setPagingData({
                    startPage: pagingData.startPage,
                    endPage: pagingData.endPage,
                    prev: pagingData.prev,
                    next: pagingData.next,
                    activeNo: pagingData.activeNo,
                });
			} catch(err) {
				console.error('Failed to get product list', err);
			}
		}
		window.scrollTo(0, 0);
		getList();

		setKeywordInput(keyword === undefined ? '' : keyword);
	}, [page, keyword]);

	//페이지네이션 버튼 이벤트
    const handlePageBtn = (type: string) => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
			keyword: keyword,
		})
    }

    const handleKeywordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeywordInput(e.target.value);
    }

    const handleSearchOnClick = async (): Promise<void> => {
        const queryString = buildQueryString({keyword: keywordInput});
        navigate(`${queryString}`);
    }

    const handleAddBtnOnClick = (): void => {
        navigate('/admin/product/add');
    }

    return (
        <div className="mypage">
            <AdminSideNav categoryStatus={'product'} />
            <div className="admin-content">
                <div className="admin-content-header admin-product-header">
                    <h1>상품 목록</h1>
                    <DefaultButton
                        btnText={'상품 추가'}
                        onClick={handleAddBtnOnClick}
                    />
                </div>
                <div className="admin-content-content">
                    <table className="admin-content-table">
                        <thead>
                        <tr>
                            <th>분류</th>
                            <th>상품명</th>
                            <th>재고</th>
                            <th>옵션 수</th>
                            <th>가격</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((bodyData, index) => {
                            return (
                                <AdminProductTableBody
                                    key={index}
                                    data={bodyData}
                                />
                            )
                        })}
                        </tbody>
                    </table>
                    <div className="admin-search">
                        <input type={'text'} onChange={handleKeywordOnChange} value={keywordInput}/>
                        <img alt={''} src={"https://as1.ftcdn.net/v2/jpg/03/25/73/68/1000_F_325736897_lyouuiCkWI59SZAPGPLZ5OWQjw2Gw4qY.jpg"} onClick={handleSearchOnClick}/>
                        <Pagination
                            pagingData={pagingData}
                            className={'like-paging'}
                            handlePageBtn={handlePageBtn}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

type AdminProductTableBodyProps = {
	data: AdminProductListType;
}	

function AdminProductTableBody(props: AdminProductTableBodyProps) {
    const { data } = props;

    return (
        <tr>
            <td>{data.classification}</td>
            <td>
                <Link to={`/admin/product/${data.productId}`}>
                    {data.productName}
                </Link>
            </td>
            <td>{data.stock}</td>
            <td>{data.optionCount}</td>
            <td>{numberComma(data.price)}</td>
        </tr>
    )
}

export default AdminProductList;