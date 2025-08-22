export const CHECK_BOX_CONSTANTS = Object.freeze({
	CHECK: 'check',
	DISABLE: 'disable'
} as const);

export type CheckBoxConstantsType = typeof CHECK_BOX_CONSTANTS[keyof typeof CHECK_BOX_CONSTANTS];
