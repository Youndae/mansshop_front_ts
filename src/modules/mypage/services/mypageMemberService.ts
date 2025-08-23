import { MyPageMemberApi } from "@/modules/mypage/api/mypageMemberApi";

import type { MyPageMemberPatchType } from "@/modules/mypage/types/mypageMemberType";
import type { AxiosResponse } from "axios";

export const getUserData = async(): Promise<AxiosResponse> =>
	await MyPageMemberApi.getUserData();

export const patchUserData = async (userData: MyPageMemberPatchType, userEmail: string): Promise<AxiosResponse> => {
	const body: MyPageMemberPatchType = {
		nickname: userData.nickname,
		phone: userData.phone,
		mail: userEmail,
	}

	return await MyPageMemberApi.patchUserData(body);
}