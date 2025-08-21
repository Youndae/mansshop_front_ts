export type UserDataType = {
	userId: string;
	userPw: string;
	checkPassword: string;
	userName: string;
	nickname: string;
	phone: string;
	email: string;
};

export type MemberState = {
	loginStatus: boolean;
	id: string | null;
	role: string | null;
};

export type RootState = {
	member: MemberState;
}

export type LoginUserDataType = {
	userId: string;
	userPw: string;
}