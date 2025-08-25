import { AdminProductApi } from "@/modules/admin/api/adminProductApi";
import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";
import type { 
	AdminPostProductDiscountType,
	AdminAddProductDataType,
	AdminAddProductOptionType,
	AdminSelectClassificationProductType
 } from "@/modules/admin/types/AdminProductType";

export const getProductList = async(page: string, keyword: string): Promise<AxiosResponse> => {
    const queryString = buildQueryString({ page, keyword });
    return await AdminProductApi.getProductList(queryString);
}

export const getProductClassificationList = async(): Promise<AxiosResponse> => 
	await AdminProductApi.getProductClassificationList();

const setAdminProductFormData = (
	productData: AdminAddProductDataType,
	optionList: AdminAddProductOptionType[],
	thumbnail: File[],
	infoImage: File[],
	firstThumbnail?: File
) => {
	const formData = new FormData();

	formData.append('classification', productData.classification);
    formData.append('productName', productData.productName);
    formData.append('price', String(productData.price));
    formData.append('isOpen', String(productData.isOpen));
    formData.append('discount', String(productData.discount));
    for(let i = 0; i < optionList.length; i++) {
        formData.append('optionList[' + i + '].optionId', String(optionList[i].optionId));
        formData.append('optionList[' + i + '].size', optionList[i].size);
        formData.append('optionList[' + i + '].color', optionList[i].color);
        formData.append('optionList[' + i + '].optionStock', String(optionList[i].optionStock));
        formData.append('optionList[' + i + '].optionIsOpen', String(optionList[i].optionIsOpen));
    }

    thumbnail.forEach(file => formData.append('thumbnail', file));
    infoImage.forEach(file => formData.append('infoImage', file));

    if(firstThumbnail)
        formData.append('firstThumbnail', firstThumbnail);

    return formData;
}


export const postProduct = async(
	productData: AdminAddProductDataType, 
	optionList: AdminAddProductOptionType[], 
	firstThumbnail: File,
	newThumbnail: File[] | [],
	newInfoImage: File[],
) => {
	const formData = setAdminProductFormData(
		productData,
		optionList,
		newThumbnail,
		newInfoImage,
		firstThumbnail
	);

	return await AdminProductApi.postProduct(formData);
}

export const getPatchProductData = async(productId: string): Promise<AxiosResponse> =>
	await AdminProductApi.getPatchProductData(productId);

export const patchProduct = async(
	productId: string,
	productData: AdminAddProductDataType, 
	optionList: AdminAddProductOptionType[], 
	newThumbnail: File[] | [],
	newInfoImage: File[] | [],
	deleteFirstThumbnail: string | '', 
	deleteOption: number[], 
	deleteThumbnail: string[] | [],
	deleteInfoImage: string[] | [],
	newFirstThumbnail?: File
): Promise<AxiosResponse> => {
	const formData = setAdminProductFormData(
		productData,
		optionList,
		newThumbnail,
		newInfoImage,
		newFirstThumbnail
	);

	//삭제되어야 할 대표 썸네일이 존재하는 경우 formData에 추가
	if(deleteFirstThumbnail !== '')
		formData.append('deleteFirstThumbnail', deleteFirstThumbnail);

	//삭제될 옵션, 썸네일, 정보 이미지 리스트를 formData에 추가
	deleteOption.forEach(deleteOptionId => formData.append('deleteOptionList', String(deleteOptionId)));
	deleteThumbnail.forEach(deleteImageName => formData.append('deleteThumbnail', deleteImageName));
	deleteInfoImage.forEach(deleteImageName => formData.append('deleteInfoImage', deleteImageName));

	return await AdminProductApi.patchProduct(productId, formData);
}

export const getProductDetail = async(productId: string): Promise<AxiosResponse> =>
	await AdminProductApi.getProductDetail(productId);

export const getProductStockList = async(page: string, keyword: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({ page, keyword });
	return await AdminProductApi.getProductStockList(queryString);
}

export const getProductListByClassification = async(classificationName: string): Promise<AxiosResponse> =>
	await AdminProductApi.getProductListByClassification(classificationName);

export const setProductDiscount = async(productData: AdminSelectClassificationProductType[], discount: number): Promise<AxiosResponse> =>{
	const productArr: string[] = [];
	productData.forEach(data => productArr.push(data.productId));

	const body: AdminPostProductDiscountType = {
		productIdList: productArr,
		discount: discount,
	}

	return await AdminProductApi.setProductDiscount(body);
}

export const getDiscountProductList = async(page: string, keyword: string): Promise<AxiosResponse> => {
	const queryString = buildQueryString({ page, keyword });
	return await AdminProductApi.getDiscountProductList(queryString);
}