import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

const BASE_URL = 'admin/order';

export const AdminOrderApi = {
	getNewOrderList: (queryString: string) => 
		axiosEnhanced.get(`${BASE_URL}/new${queryString}`),
	patchOrderStatus: (orderId: number) => 
		axiosEnhanced.patch(`${BASE_URL}/${orderId}`),
	getAllOrderList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/all${queryString}`)
}