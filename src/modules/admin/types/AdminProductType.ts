export type AdminAddProductDataType = {
	classification: string;
	productName: string;
	price: number;
	isOpen: boolean;
	discount: number;
}

export type AdminAddProductOptionType = {
	optionId: number;
	size: string;
	color: string;
	optionStock: number;
	optionIsOpen: boolean;
}

export type AdminPostProductDiscountType = {
	productIdList: string[];
	discount: number;
}

export type AdminSelectClassificationProductType = {
	productId: string;
	productName: string;
	productPrice: number;
}

export type AdminDiscountProductListType = {
	productId: string;
	classification: string;
	productName: string;
	price: number;
	discount: number;
	totalPrice: number;
}

export type AdminProductDetailType = {
	classification: string;
	productName: string;
	price: number;
	isOpen: boolean;
	sales: number;
	discount: number;
	discountPrice: number;
}

export type AdminProductListType = {
	productId: string;
	classification: string;
	productName: string;
	stock: number;
	optionCount: number;
	price: number;
}

export type AdminProductStockOptionType = {
	size: string;
	color: string;
	optionStock: number;
	optionIsOpen: boolean;
}

export type AdminProductStockListType = {
	productId: string;
	classification: string;
	productName: string;
	totalStock: number;
	isOpen: boolean;
	optionList: AdminProductStockOptionType[];
}