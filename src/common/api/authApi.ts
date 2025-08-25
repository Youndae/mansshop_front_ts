import { axiosEnhanced } from '@/common/utils/axios/axiosEnhanced';

export const AuthAPI = {
	getMemberStatus: () => 
		axiosEnhanced.get('member/status'),
	getReissueToken: () =>
		axiosEnhanced.get('reissue'),
}