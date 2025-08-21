import { AuthAPI } from '@/common/api/authApi';
import type { MemberStatusResponse } from '@/common/types/authType';
import type { AxiosResponse } from "axios"

export const getMemberStatus = async () :Promise<MemberStatusResponse> => {
	const res: AxiosResponse = await AuthAPI.getMemberStatus();

	return res.data;
}

export const getReIssueToken = async (): Promise<AxiosResponse> => 
	await AuthAPI.getReissueToken();