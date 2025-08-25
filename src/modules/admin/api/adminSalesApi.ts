import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

const BASE_URL = 'admin/sales';

export const AdminSalesApi = {	
	getYearSalesData: (year: number) =>
		axiosEnhanced.get(`${BASE_URL}/period/${year}`),
	getMonthSalesData: (date: string) =>
		axiosEnhanced.get(`${BASE_URL}/period/detail/${date}`),
	getMonthDailySalesData: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/period/detail/day${queryString}`),
	getMonthClassificationSalesData: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/period/detail/classification${queryString}`),
	getDailyOrderList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/period/order-list${queryString}`),
	getProductSalesList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}/product${queryString}`),
	getProductSalesDetail: (productId: string) =>
		axiosEnhanced.get(`${BASE_URL}/product/detail/${productId}`),
}