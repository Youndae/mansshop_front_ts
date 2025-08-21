import { useEffect, useState } from 'react';

import { getBestProductList } from '@/modules/main/services/mainService';

import MainContent from '@/modules/main/components/MainContent';

import type { ProductDataType } from '@/modules/main/types/MainProductType';
import type { AxiosResponse } from 'axios';

/*
    메인 BEST 상품 목록 페이지. 애플리케이션의 index Component
    메인 페이지의 상품 목록들은 모두 MainContent Component를 통해 리스트 출력
 */
function Best() {
	const [data, setData] = useState<ProductDataType[]>([]);
	
	useEffect(() => {
		const getBest = async () => {
			try {
				const res: AxiosResponse = await getBestProductList();
				setData(res.data);
			} catch (err) {
				console.log(err);
			}
		}

		getBest();
	}, []);

	return (
		<>
			<MainContent
				data={data}
				classification={'BEST'}
			/>
		</>
	)
}

export default Best;