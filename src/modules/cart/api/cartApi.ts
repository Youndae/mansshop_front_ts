import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

const BASE_URL = 'api/cart/';

export const CartApi = {
	getCartList: () =>
		axiosEnhanced.get(`${BASE_URL}`),
	increaseCartCount: (detailId: number) =>
		axiosEnhanced.patch(`${BASE_URL}count-up/${detailId}`),
	decreaseCartCount: (detailId: number) =>
		axiosEnhanced.patch(`${BASE_URL}count-down/${detailId}`),
	deleteSelectCartProduct: (selectValue: number[]) =>
		axiosEnhanced.delete(`${BASE_URL}select`, { data: selectValue }),
	deleteAllCartProduct: () =>
		axiosEnhanced.delete(`${BASE_URL}all`),
	getOrderProductInfo: (detailIds: number[]) =>
		axiosEnhanced.post(`api/order/cart`, detailIds),
}