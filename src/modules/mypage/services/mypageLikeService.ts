import { MyPageLikeApi } from "@/modules/mypage/api/mypageLikeApi";
import { ProductApi } from "@/modules/product/api/productApi";

import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";

export const getLikeProductList = async(page: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({page});

	return await MyPageLikeApi.getLikeProductList(queryString);
}

export const deLikeProduct = async(productId: string): Promise<AxiosResponse> =>
	await ProductApi.deLikeProduct(productId);