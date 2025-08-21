import { MemberApi } from "@/modules/member/api/memberApi";
import { buildQueryString } from "@/common/utils/queryStringUtils";

import type { AxiosResponse } from "axios";
import type { LoginUserDataType, UserDataType } from "@/common/types/userDataType";

export const postLogout = async (): Promise<AxiosResponse> => 
	await MemberApi.postLogout();

export const postLogin = async (userData: LoginUserDataType): Promise<AxiosResponse> => 
	await MemberApi.postLogin(userData);

export const postJoin = async (userData: UserDataType, userEmail: string, userBirth: string): Promise<AxiosResponse> =>
	await MemberApi.postJoin(userData, userEmail, userBirth);

export const getUserIdCheck = async (userId: string): Promise<AxiosResponse> =>
	await MemberApi.getUserIdCheck(userId);

export const getNicknameCheck = async (nickname: string): Promise<AxiosResponse> =>
	await MemberApi.getNicknameCheck(nickname);

export const tokenRequest = async (): Promise<AxiosResponse> =>
	await MemberApi.tokenRequest();

export const getSearchId = async (username: string, type: string, value: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({
		username: username,
		[type]: value,
	});

	return await MemberApi.getSearchId(queryString);
}

export const getSearchPw = async (userId: string, username: string, email: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({
		id: userId,
		name: username,
		email: email,
	});

	return await MemberApi.getSearchPw(queryString);
}

export const postCertification = async (userId: string, certification: string): Promise<AxiosResponse> => {
	const queryString: string = buildQueryString({
		userId: userId,
		certification: certification,
	});

	return await MemberApi.postCertification(queryString);
}

export const postResetPassword = async (userId: string, certification: string, userPw: string): Promise<AxiosResponse> =>
	await MemberApi.postResetPassword(userId, certification, userPw);