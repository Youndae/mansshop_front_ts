export const RESPONSE_MESSAGE = Object.freeze({
	OK: 'OK',
	FAIL: 'FAIL',
	LOGIN_FAIL: 'BadCredentialsException',
	DUPLICATED: 'duplicated',
	NO_DUPLICATED: 'No duplicates',
	FOUND: 'found',
	NOT_FOUND: 'not found',
	ERROR: 'ERROR',
} as const);

export type ResponseMessage = (typeof RESPONSE_MESSAGE)[keyof typeof RESPONSE_MESSAGE];