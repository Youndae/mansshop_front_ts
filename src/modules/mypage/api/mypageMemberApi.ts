import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { MyPageMemberPatchType } from "@/modules/mypage/types/mypageMemberType";

const BASE_URL = 'api/my-page/';

export const MyPageMemberApi = {
	getUserData: async() =>
		axiosEnhanced.get(`${BASE_URL}info`),
	patchUserData: async(body: MyPageMemberPatchType) =>
		axiosEnhanced.patch(`${BASE_URL}info`, body),
}