export const PAGINATION_BTN = Object.freeze({
	PREV: 'prev',
    NEXT: 'next',
} as const);

export type PaginationButtonType = (typeof PAGINATION_BTN)[keyof typeof PAGINATION_BTN];