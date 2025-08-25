import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { AdminMemberPostPointType } from "@/modules/admin/types/AdminMemberType";

const BASE_URL = 'admin/member';

export const AdminMemberApi = {
	getMemberList: (queryString: string) =>
		axiosEnhanced.get(`${BASE_URL}${queryString}`),
	postPoint: (body: AdminMemberPostPointType) =>
		axiosEnhanced.patch(`${BASE_URL}/point`, body),
}