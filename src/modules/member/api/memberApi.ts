import { axiosSimple } from "@/common/utils/axios/axiosSimple";
import { axiosEnhanced } from "@/common/utils/axios/axiosEnhanced";

import type { LoginUserDataType, UserDataType } from "@/common/types/userDataType";

const BASE_URL: string = 'api/member/';

export const MemberApi = {
	postLogout: () => 
		axiosSimple.post(`${BASE_URL}logout`),
	postLogin: (userData: LoginUserDataType) => 
		axiosSimple.post(
			`${BASE_URL}login`,
			{
				userId: userData.userId,
				userPw: userData.userPw,
			}
		),
	postJoin: (userData: UserDataType, userEmail: string, userBirth: string) =>
		axiosSimple.post(
			`${BASE_URL}join`,
			{
				userId: userData.userId,
				userPw: userData.userPw,
				userName: userData.userName,
				nickname: userData.nickname,
				phone: userData.phone,
				birth: userBirth,
				email: userEmail,
			}
		),
	getUserIdCheck: (userId: string) => 
		axiosSimple.get(`${BASE_URL}check-id?userId=${userId}`),
	getNicknameCheck: (nickname: string) =>
		axiosSimple.get(`${BASE_URL}check-nickname?nickname=${nickname}`),
	tokenRequest: () =>
		axiosEnhanced.get(`${BASE_URL}oAuth/token`),
	getSearchId: (queryString: string) =>
		axiosSimple.get(`${BASE_URL}search-id${queryString}`),
	getSearchPw: (queryString: string) =>
		axiosSimple.get(`${BASE_URL}search-pw${queryString}`),
	postCertification: (queryString: string) =>
		axiosSimple.post(`${BASE_URL}certification${queryString}`),
	postResetPassword: (userId: string, certification: string, userPw: string) =>
		axiosSimple.post(`${BASE_URL}reset-pw`, {
			userId: userId,
			certification: certification,
			userPw: userPw,
		}),
}