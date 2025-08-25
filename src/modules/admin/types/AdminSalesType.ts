export type AdminYearSalesType = {
	sales: number;
	salesQuantity: number;
	orderQuantity: number;
}

export type AdminPeriodSalesListType = {
	date: number;
	sales: number;
	salesQuantity: number;
	orderQuantity: number;
}

export type AdminDailySalesDetailType = {
	productName: string;
	size: string;
	color: string;
	count: number;
	price: number;
}

export type AdminDailyOrderListType = {
	totalPrice: number;
	deliveryFee: number;
	paymentType: string;
	detailList: AdminDailySalesDetailType[];
}

export type AdminMonthSalesType = {
	sales: number;
	salesQuantity: number;
	orderQuantity: number;
	lastYearComparison: number;
	lastYearSales: number;
	lastYearSalesQuantity: number;
	lastYearOrderQuantity: number;
}

export type AdminPeriodBestProductType = {
	productName: string;
	productPeriodSalesQuantity: number;
	productPeriodSales: number;
}

export type AdminPeriodClassificationSalesType = {
	classification: string;
	classificationSales: number;
	classificationSalesQuantity: number;
}

export type AdminDailyModalDataType = {
	selectDate: string;
	sales: number;
	salesQuantity: number;
	orderQuantity: number;
	classificationList: AdminPeriodClassificationSalesType[];
}

export type AdminClassificationModalProductType = {
	productName: string;
	size: string;
	color: string;
	productSales: number;
	productSalesQuantity: number;
}

export type AdminPeriodClassificationModalDataType = {
	name: string;
	sales: number;
	salesQuantity: number;
	productList: AdminClassificationModalProductType[];
}

export type AdminProductSalesListType = {
	classification: string;
	productId: string;
	productName: string;
	sales: number;
	salesQuantity: number;
}

export type AdminProductSalesDetailType = {
	productName: string;
	totalSales: number;
	totalSalesQuantity: number;
	yearSales: number;
	yearSalesQuantity: number;
	lastYearComparison: number;
	lastYearSales: number;
	lastYearSalesQuantity: number;
	year: number;
}

export type AdminProductSalesOptionType = {
	optionId: number;
	size: string;
	color: string;
	optionSales: number;
	optionSalesQuantity: number;
}