export const CART_SELECT_CONSTANTS = Object.freeze({
	SELECT: 'select',
	SELECT_ALL: 'selectAll',
	ALL: 'all',
} as const);

export type CartSelectConstantsType = typeof CART_SELECT_CONSTANTS[keyof typeof CART_SELECT_CONSTANTS];