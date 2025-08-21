export type OrderDetailDataType = {
	orderId: number;
	productId: string;
	optionId: number;
	detailId: number;
	productName: string;
	size: string;
	color: string;
	detailCount: number;
	detailPrice: number;
	reviewStatus: boolean;
	thumbnail: string;
}

export type OrderDataType = {
	orderId: number;
	orderTotalPrice: number;
	orderDate: string;
	orderStat: string;
	detail: OrderDetailDataType[];
}