export type AdminOrderDetailType = {
	classification: string;
	productName: string;
	size: string;
	color: string;
	count: number;
	price: number;
	reviewStatus: boolean;
}

export type AdminOrderListType = {
	orderId: number;
	recipient: string;
	userId: string;
	phone: string;
	createdAt: string;
	address: string;
	orderStatus: string;
	detailList: AdminOrderDetailType[];
}