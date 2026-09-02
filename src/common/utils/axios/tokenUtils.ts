const AUTH_KEY = 'Authorization';

export const getToken = (): string | null => localStorage.getItem(AUTH_KEY);