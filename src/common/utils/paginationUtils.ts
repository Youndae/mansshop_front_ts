import { buildQueryString } from '@/common/utils/queryStringUtils';
import { PAGINATION_BTN } from '@/common/constants/paginationButton';

import type { NavigateFunction } from 'react-router-dom';
import type { PagingObject } from '@/common/types/paginationType';

// 페이지네이션에서 사용될 pagingObject 객체 생성
const createPagingObject = (page: number, elementSize: number, totalPages: number): PagingObject => {
	let endPage: number = Number(Math.ceil(page / elementSize) * elementSize);
	const startPage: number = endPage - (elementSize - 1);

	if(totalPages < endPage) {
		endPage = totalPages;
	}

	return {
		startPage,
		endPage,
		prev: startPage > 1,
		next: endPage < totalPages,
		activeNo: page
	};
}

// 페이지네이션의 ElementSize가 10인 기본 설정
export const mainProductPagingObject = (page: number = 1, totalPages: number): PagingObject =>
	createPagingObject(page, 10, totalPages);
// 페이지네이션의 ElementSize가 5인 경우
export const productDetailPagingObject = (page: number = 1, totalPages: number): PagingObject =>
	createPagingObject(page, 5, totalPages);

// 각 페이지네이션 버튼 클릭 시 페이지 번호 반환
const getPrevNumber = (pagingData: PagingObject): number => pagingData.startPage - 1;
const getNextNumber = (pagingData: PagingObject): number => pagingData.endPage + 1;

// 페이지네이션 버튼 클릭 이벤트 객체 생성
const buildQueryForm = ({ 
	type, 
	page, 
	keyword, 
	searchType, 
	term 
}: {
	type?: string;
	page?: number;
	keyword?: string;
	searchType?: string;
	term?: string;
}) => {
	return {
		...(type !== undefined && { type }),
		...(page !== undefined && { page }),
		...(keyword !== undefined && { keyword }),
		...(searchType !== undefined && { searchType }),
		...(term !== undefined && { term })
	};
};

// 검색 타입만 존재하고 keyword가 없는 경우 undefined 반환
// 검색 타입 상태값이 기본값으로 동작하기 때문에 불필요한 SearchType 값이 전달되는 것을 방지
export const validateSearchType = ({
	keyword, 
	searchType
}: {
	keyword?: string; 
	searchType?: string
}): string | undefined => 
	keyword ? searchType: undefined;

export const handlePageChange = (
	{typeOrNumber, pagingData, navigate, listType, keyword, searchType, term}
	: {
		typeOrNumber: string;
		pagingData: PagingObject;
		navigate: NavigateFunction;
		listType?: string | undefined;
		keyword?: string | undefined;
		searchType?: string | undefined;
		term?: string | undefined;
	}
): void => {
	const targetPage: number | undefined = getClickPageNumber(typeOrNumber, pagingData);
	if(targetPage === undefined) return;

	const searchTypeValue: string | undefined = validateSearchType({keyword, searchType});
	const queryObject: Record<string, string | number | undefined> = buildQueryForm({
		type: listType,
		page: targetPage,
		keyword,
		searchType: searchTypeValue,
		term
	});

	const queryString: string = buildQueryString(queryObject);
	console.log('queryString', queryString);
	navigate(`${queryString}`);
}

export const getClickPageNumber = (typeOrNumber: string, pagingData: PagingObject): number | undefined => {
	let targetPage: number;
	
	if(typeOrNumber === PAGINATION_BTN.PREV) {
		targetPage = getPrevNumber(pagingData);
	}else if(typeOrNumber === PAGINATION_BTN.NEXT) {
		targetPage = getNextNumber(pagingData);
	}else if(typeof typeOrNumber === 'string') {
		targetPage = Number(typeOrNumber);
	}else {
		return;
	}

	return targetPage;
}