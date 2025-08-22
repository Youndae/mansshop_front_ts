import type { SelectCartDetailType } from '@/modules/cart/types/cartTypes';

export const setSelectCartDetail = (selectValue: SelectCartDetailType[]): number[] => {
	const arr: SelectCartDetailType[] = [...selectValue];
	const resultArr: number[] = [];

	for(let i = 0; i < arr.length; i++) {
		if(arr[i].status)
			resultArr.push(arr[i].cartDetailId);
	}

	return resultArr;
}

export const setAllCartDetail = (selectValue: SelectCartDetailType[]): number[] => {
	const arr: SelectCartDetailType[] = [...selectValue];
	const resultArr: number[] = [];

	for(let i = 0; i < arr.length; i++) {
		resultArr.push(arr[i].cartDetailId);
	}

	return resultArr;
}

export const setCheckBoxStatus = (
	{idx, selectValue}
	: {idx: number, selectValue: SelectCartDetailType[]}
): SelectCartDetailType[] => {
	const arr = [...selectValue];
	arr[idx] = {
		...arr[idx],
		status: !arr[idx].status
	}

	return arr;
}