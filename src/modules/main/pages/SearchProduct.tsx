import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { mainProductPagingObject } from '@/common/utils/paginationUtils';
import { handlePageChange } from '@/common/utils/paginationUtils';
import { getSearchProductList } from '@/modules/main/services/mainService';

import Pagination from '@/common/components/Pagination';
import MainContent from '@/modules/main/components/MainContent';

import type { ProductDataType } from '@/modules/main/types/MainProductType';
import type { PagingObjectType } from '@/common/types/paginationType';
import type { AxiosResponse } from 'axios';

//상품 검색 컴포넌트
function SearchProduct() {
	const [params] = useSearchParams();
	const { page = '1', keyword = '' } = Object.fromEntries(params);

	const [data, setData] = useState<ProductDataType[]>([]);
	const [pagingData, setPagingData] = useState<PagingObjectType>({
		startPage: 0,
		endPage: 0,
		prev: false,
		next: false,
		activeNo: Number(page),
	});

	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);

		const getSearchProduct = async(): Promise<void> => {
			try{
				const res: AxiosResponse = await getSearchProductList(page, keyword);
				setData(res.data.content);
				const pagingData = mainProductPagingObject(Number(page), res.data.totalPages);
				setPagingData({
					startPage: pagingData.startPage,
					endPage: pagingData.endPage,
					prev: pagingData.prev,
					next: pagingData.next,
					activeNo: pagingData.activeNo,
				});
			}catch(err) {
				console.error('search product list error : ', err);
			}
		}
		getSearchProduct();
	}, [page, keyword]);

	//페이지네이션 버튼 이벤트
	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
			keyword
		})
	}

	return (
		<>
            <MainContent
                data={data}
                classification={''}
            />
            <Pagination
                pagingData={pagingData}
                handlePageBtn={handlePageBtn}
            />
        </>
	)
}

export default SearchProduct;