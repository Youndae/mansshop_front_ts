export type PagingObjectType = {
	startPage: number;
	endPage: number;
	prev: boolean;
	next: boolean;
	activeNo: number;
}

export type PagingObjectWithTotalType = PagingObjectType & {
	totalElements: number;
}