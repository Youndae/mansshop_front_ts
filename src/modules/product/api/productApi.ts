import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { ProductOptionCountType } from "@/modules/product/types/productType";

const BASE_URL = 'api/product/';

/*
	addList
		optionId: number;
		count: number;
	selectData
		optionId: number;
		count: number;
*/

export const ProductApi = {
	getProductDetail: (productId: string) =>
		axiosEnhanced.get(`${BASE_URL}${productId}`),
	getOrderData: (selectData: ProductOptionCountType[]) => 
		axiosEnhanced.post(`api/order/product`, selectData),
	addCart: (addList: ProductOptionCountType[]) =>
		axiosEnhanced.post(`api/cart/`, addList),
	likeProduct: (productId: string) =>
		axiosEnhanced.post(`${BASE_URL}like`, {productId}),
	deLikeProduct: (productId: string) =>
		axiosEnhanced.delete(`${BASE_URL}like/${productId}`),
	getProductReview: (productId: string, queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}${productId}/review${queryString}`),
	getProductQnA: (productId: string, queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}${productId}/qna${queryString}`),
	postProductQnA: (productId: string, qnaInputValue: string) =>
		axiosEnhanced.post(`${BASE_URL}qna`, 
			{
				productId: productId,
				content: qnaInputValue,
			}),
}