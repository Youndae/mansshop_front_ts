import { CartApi } from '@/modules/cart/api/cartApi';
import { CART_SELECT_CONSTANTS } from '../constants/cartSelectConstants';
import { setSelectCartDetail } from '@/modules/cart/utils/cartUtils';

import type { SelectCartDetailType } from '@/modules/cart/types/cartTypes';
import type { AxiosResponse } from 'axios';

export const getCartList = async (): Promise<AxiosResponse> =>
	await CartApi.getCartList();

export const updateCartCount = async(type: string, name: number, callback: () => void): Promise<void> => {
	try {
		const apiCall = type === 'increase' ? CartApi.increaseCartCount : CartApi.decreaseCartCount;

		const res: AxiosResponse = await apiCall(name);

		if(res.status === 204) {
			callback?.();
		}
	}catch (error) {
		console.error('updateCartCount error', error);
	}
}

export const deleteSelectCartProduct = async(type: string, selectValue: SelectCartDetailType[] | SelectCartDetailType, callback: () => void): Promise<void> => {
	let selectValueArr: number[] = [];

	if(type === CART_SELECT_CONSTANTS.SELECT) {
		selectValueArr.push((selectValue as SelectCartDetailType).cartDetailId);
	}else if(type === CART_SELECT_CONSTANTS.SELECT_ALL) {
		selectValueArr = setSelectCartDetail(selectValue as SelectCartDetailType[]);
	}

	try {
		const res: AxiosResponse = await CartApi.deleteSelectCartProduct(selectValueArr);

		if(res.status === 204) {
			callback?.();
		}
	}catch (error) {
		console.error('deleteSelectCartProduct error', error);
	}
}

export const deleteAllCartProduct = async(): Promise<AxiosResponse> =>
	await CartApi.deleteAllCartProduct();

export const getOrderProductInfo = async(detailIds: number[]): Promise<AxiosResponse> =>
	await CartApi.getOrderProductInfo(detailIds);