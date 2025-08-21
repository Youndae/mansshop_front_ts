import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import { mainProductPagingObject } from "@/common/utils/paginationUtils";
import { handlePageChange } from "@/common/utils/paginationUtils";
import { getClassificationList } from "@/modules/main/services/mainService";

import MainContent from "@/modules/main/components/MainContent";
import Pagination from "@/common/components/Pagination";

import type { ProductDataType } from "@/modules/main/types/MainProductType";
import type { PagingObjectType } from "@/common/types/paginationType";
import type { AxiosResponse } from "axios";

/*
    분류별 상품 목록 페이지
    선택한 상품 분류에 따라 해당하는 상품 목록 출력
 */
function MainClassification() {
	const { classification } = useParams() as { classification: string };
	const [params] = useSearchParams();
	const { page = '1' } = Object.fromEntries(params);

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

		const classificationList = async () => {
			try {
				const res: AxiosResponse = await getClassificationList(classification, page);
				setData(res.data.content);
				const pagingData = mainProductPagingObject(Number(page), res.data.totalPages);
				setPagingData({
					startPage: pagingData.startPage,
					endPage: pagingData.endPage,
					prev: pagingData.prev,
					next: pagingData.next,
					activeNo: pagingData.activeNo,
				});
			} catch (err) {
				console.log(err);
			}
		}

		classificationList();
	}, [classification, page]);

	const handlePageBtn = (type: string): void => {
		handlePageChange({
			typeOrNumber: type,
			pagingData,
			navigate,
		});
	}

	return (
        <>
            <MainContent
                data={data}
                classification={classification}
            />
			<Pagination
				pagingData={pagingData}
				className={undefined}
				handlePageBtn={handlePageBtn}
			/>
        </>
    )
}

export default MainClassification;