import { OrderApi } from "@/modules/order/api/orderApi";
import type { AxiosResponse } from "axios";
import type { 
	PostOrderProductType, 
	OrderPostDataType, 
	OrderDataType, 
	OrderProductType, 
	OrderAddressType,
	OrderValidateDataType
} from "@/modules/order/types/orderType";

export const postPayment = async (val: string): Promise<AxiosResponse> => 
	await OrderApi.postPayment(val);

export const postOrderData = async({
	orderData,
	userAddress,
	orderProduct,
	deliveryFee,
	totalPrice,
	paymentType,
	orderType
}: {
	orderData: OrderDataType;
	userAddress: OrderAddressType;
	orderProduct: OrderProductType[];
	deliveryFee: number;
	totalPrice: number;
	paymentType: string;
	orderType: string;
}): Promise<AxiosResponse> => {
	const addr: string = `${userAddress.postCode} ${userAddress.address} ${userAddress.detail}`;
	const productArr: PostOrderProductType[] = [];
	for(let i = 0; i < orderProduct.length; i++) {
		productArr.push({
			optionId: orderProduct[i].optionId,
			size: orderProduct[i].size,
			color: orderProduct[i].color,
			productName: orderProduct[i].productName,
			productId: orderProduct[i].productId,
			detailCount: orderProduct[i].count,
			detailPrice: orderProduct[i].price,
		})
	}

	const body: OrderPostDataType = {
		recipient: orderData.recipient,
		phone: orderData.phone,
		orderMemo: orderData.orderMemo,
		address: addr,
		orderProduct: productArr,
		deliveryFee: deliveryFee,
		totalPrice: totalPrice,
		paymentType: paymentType,
		orderType: orderType,
	}

	return await OrderApi.postOrderData(body);
}

export const orderDataValidate = async ({orderProduct, totalPrice}: {orderProduct: OrderProductType[], totalPrice: number}): Promise<AxiosResponse> => {
	const productArr: OrderProductType[] = [];
	for(let i = 0; i < orderProduct.length; i++) {
		productArr.push({
			productId: orderProduct[i].productId,
			optionId: orderProduct[i].optionId,
			productName: orderProduct[i].productName,
			size: orderProduct[i].size,
			color: orderProduct[i].color,
			count: orderProduct[i].count,
			price: orderProduct[i].price,
		})
	}

	const body: OrderValidateDataType = {
		orderData: productArr,
		totalPrice: totalPrice,
	}

	return await OrderApi.validateOrderData(body);
}