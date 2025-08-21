import { useEffect, useState } from 'react';

import { getNewProductList } from '@/modules/main/services/mainService';

import MainContent from '@/modules/main/components/MainContent';

import type { ProductDataType } from '@/modules/main/types/MainProductType';
import type { AxiosResponse } from 'axios';

/*
    새로운 상품 리스트.
    상품 등록일을 기준으로 조회
 */
function New() {
	const [data, setData] = useState<ProductDataType[]>([]);

	useEffect(() => {
		const getNew = async () => {
			try {
				const res: AxiosResponse = await getNewProductList();
				setData(res.data);
			} catch (err) {
				console.error('new product list error : ', err);
			}
		}

		getNew();
	}, []);

	return (
		<>
			<MainContent
				data={data}
				classification={'NEW'}
			/>
		</>
	)
}

export default New;