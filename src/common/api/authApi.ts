import { axiosEnhanced } from '@/common/utils/axios/axiosEnhanced';

export const AuthAPI = {
	getMemberStatus: () => 
		axiosEnhanced.get('api/member/status'),
	getReissueToken: () =>
		axiosEnhanced.get('api/reissue'),
}