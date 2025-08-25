import { axiosSimple } from "@/common/utils/axios/axiosSimple";
import type { OrderPostDataType, OrderValidateDataType } from "../types/orderType";

const BASE_URL = 'order';

export const OrderApi = {
	postPayment: (val: string) =>
		axiosSimple.post(`payment/iamport/${val}`),
	postOrderData: (body: OrderPostDataType) =>
		axiosSimple.post(`${BASE_URL}/`, body),
	validateOrderData: (body: OrderValidateDataType) =>
		axiosSimple.post(`${BASE_URL}/validate`, body),
}