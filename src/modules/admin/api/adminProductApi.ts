import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { AdminPostProductDiscountType } from "@/modules/admin/types/AdminProductType";

const BASE_URL = 'admin/product';

export const AdminProductApi = {
    getProductList: (queryString = '') =>
        axiosEnhanced.get(`${BASE_URL}${queryString}`),
	getProductClassificationList: () =>
		axiosEnhanced.get(`${BASE_URL}/classification`),
	postProduct: (formData: FormData) =>
		axiosEnhanced.post(`${BASE_URL}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		}),
	getPatchProductData: (productId: string) =>
		axiosEnhanced.get(`${BASE_URL}/patch/${productId}`),
	patchProduct: (productId: string, formData: FormData) =>
		axiosEnhanced.patch(`${BASE_URL}/${productId}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		}),
	getProductDetail: (productId: string) =>
		axiosEnhanced.get(`${BASE_URL}/detail/${productId}`),
	getProductStockList: (queryString = '') =>
		axiosEnhanced.get(`${BASE_URL}/stock${queryString}`),
	getProductListByClassification: (classificationName: string) =>
		axiosEnhanced.get(`${BASE_URL}/discount/select/${classificationName}`),
	setProductDiscount: (body: AdminPostProductDiscountType) =>
		axiosEnhanced.patch(`${BASE_URL}/discount`, body),
	getDiscountProductList: (queryString = '') =>
		axiosEnhanced.get(`${BASE_URL}/discount${queryString}`),
}