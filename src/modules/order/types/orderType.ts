export type PostOrderProductType = {
	optionId: number;
	size: string;
	color: string;
	productName: string;
	productId: string;
	detailCount: number;
	detailPrice: number;
}

export type OrderPostDataType = {
	recipient: string;
	phone: string;
	orderMemo: string;
	address: string;
	orderProduct: PostOrderProductType[];
	deliveryFee: number;
	totalPrice: number;
	paymentType: string;
	orderType: string;
}

export type OrderDataType = {
	recipient: string;
	phone: string;
	orderMemo: string;
}

export type OrderAddressType = {
	postCode: string;
	address: string;
	detail: string;
}

export type OrderProductType = {
	productId: string;
	optionId: number;
	productName: string;
	size: string;
	color: string;
	count: number;
	price: number;
}

export type OrderValidateDataType = {
	orderData: OrderProductType[];
	totalPrice: number;
}