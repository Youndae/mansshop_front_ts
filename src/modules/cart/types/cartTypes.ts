export type CartDetailType = {
	cartDetailId: number;
	productId: string;
	optionId: number;
	productName: string;
	productThumbnail: string;
	size: string;
	color: string;
	count: number;
	originPrice: number;
	price: number;
	discount: number;
}

export type SelectCartDetailType = {
	productId: string;
	cartDetailId: number;
	size: string;
	color: string;
	count: number;
	originPrice: number;
	price: number;
	discount: number;
	status: boolean;
}