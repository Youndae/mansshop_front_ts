import { AuthAPI } from '@/common/api/authApi';
import type { AxiosResponse } from "axios"

export const getReIssueToken = async (): Promise<AxiosResponse> => 
	await AuthAPI.getReissueToken();