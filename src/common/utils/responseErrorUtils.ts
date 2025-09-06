import { AxiosError } from 'axios';

export const parseStatusAndMessage = (error: AxiosError) => {
    const status: number = error.response?.status ?? 0;
    const message = (error.response?.data as { errorMessage?: string } | undefined)?.errorMessage ?? '';

    return { status, message};
}