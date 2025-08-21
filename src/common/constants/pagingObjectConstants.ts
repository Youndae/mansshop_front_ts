export const DEFAULT_PAGING_OBJECT = Object.freeze({
	startPage: 0,
	endPage: 0,
	prev: false,
	next: false,
	activeNo: 1,
	totalElements: 0,
}as const);

export const DEFAULT_PAGING_OBJECT_WITH_TOTAL = Object.freeze({
	...DEFAULT_PAGING_OBJECT,
	totalElements: 0,
}as const);

export type PagingObject = typeof DEFAULT_PAGING_OBJECT;
export type PagingObjectWithTotal = typeof DEFAULT_PAGING_OBJECT_WITH_TOTAL;