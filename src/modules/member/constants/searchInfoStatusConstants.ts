export const SEARCH_STATUS = Object.freeze({
    NOT_FOUND: 'not found',
    FOUND: 'found',
    NAME: 'name',
    PHONE: 'phone',
    EMAIL: 'email',
    EMAIL_INVALID: 'email invalid',
    ID: 'id',
} as const);

export type SearchInfoStatusConstantsType = typeof SEARCH_STATUS[keyof typeof SEARCH_STATUS];