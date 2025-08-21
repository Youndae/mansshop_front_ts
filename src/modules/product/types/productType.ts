export type ProductOptionCountType = {
	optionId: number;
	count: number;
}

export type ProductDetailDataType = {
	productId: string;
	productName: string;
	productPrice: number;
	productLikeStat: boolean;
	discount: number;
	discountPrice: number;
}

export type ProductDetailType = {
	productId: string;
	productName: string;
	productPrice: number;
	productImageName: string;
	likeStat: boolean;
	discount: number;
	discountPrice: number;
	productOptionList: ProductDetailOptionType[];
	productThumbnailList: string[];
	productInfoImageList: string[];
	productReviewList: ProductDetailReviewType;
	productQnAList: ProductDetailQnAType;
}

export type ProductDetailOptionType = {
	optionId: number;
	size: string;
	color: string;
	stock: number;
}

type ProductDetailPaginatedResponseType<T> = {
	content: T[];
	empty: boolean;
	number: number;
	totalPages: number;
	totalElements: number;
}

export type ProductDetailReviewType = ProductDetailPaginatedResponseType<ProductDetailReviewItemType>;

export type ProductDetailQnAType = ProductDetailPaginatedResponseType<ProductDetailQnAItemType>;

export type ProductDetailReviewItemType = {
	reviewWriter: string;
	reviewContent: string;
	reviewCreatedAt: string;
	answerContent: string;
	answerCreatedAt: string;
}

export type ProductDetailQnAItemType = {
	qnaId: number;
	writer: string;
	qnaContent: string;
	createdAt: string;
	productQnAStat: boolean;
	replyList: ProductDetailQnAReplyType[];
}

export type ProductDetailQnAReplyType = {
	writer: string;
	content: string;
	createdAt: string;
}