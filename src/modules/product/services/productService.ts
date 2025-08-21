import { ProductApi } from "@/modules/product/api/productApi";
import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { ProductOptionCountType } from "@/modules/product/types/productType";
import type { AxiosResponse } from "axios";

export const getProductDetail = async (productId: string): Promise<AxiosResponse> =>
	await ProductApi.getProductDetail(productId);

export const getOrderData = async (selectData: ProductOptionCountType[]): Promise<AxiosResponse> => 
	await ProductApi.getOrderData(selectData);


export const addCart = async (addList: ProductOptionCountType[]): Promise<AxiosResponse> => 
	await ProductApi.addCart(addList);

export const likeProduct = async (productId: string): Promise<AxiosResponse> => 
	await ProductApi.likeProduct(productId);


export const deLikeProduct = async (productId: string): Promise<AxiosResponse> => 
	await ProductApi.deLikeProduct(productId);

export const getProductReview = async (productId: string, page: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({ page });
	return await ProductApi.getProductReview(productId, queryString);
}

export const getProductQnA = async (productId: string, page: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({ page });
	return await ProductApi.getProductQnA(productId, queryString);
}

export const postProductQnA = async (productId: string, qnaInputValue: string): Promise<AxiosResponse> => 
	await ProductApi.postProductQnA(productId, qnaInputValue);
