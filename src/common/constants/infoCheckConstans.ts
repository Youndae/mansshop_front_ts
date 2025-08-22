export const INFO_CHECK = Object.freeze({
	VALID: 'valid',
	INVALID: 'invalid',
	SHORT: 'short',
	DUPLICATED: 'duplicated',
	NOT_DUPLICATED: 'notDuplicateCheck',
	EMPTY: 'empty',
	ERROR: "err",
} as const);

export type InfoCheckConstantsType = typeof INFO_CHECK[keyof typeof INFO_CHECK];