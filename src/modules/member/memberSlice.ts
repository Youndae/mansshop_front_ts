import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { MemberState } from "@/common/types/userDataType";

type LoginPayload = {
	accessToken: string;
	userId: string;
	role: string;
};

const initialState: MemberState = {
	loginStatus: false,
	accessToken: null,
	id: null,
	role: null,
};


const memberSlice = createSlice({
	name: 'member',
	initialState,
	reducers: {
		login(state, action: PayloadAction<LoginPayload>) {
			const { accessToken, userId, role } = action.payload;
			state.loginStatus = true;
			state.accessToken = accessToken;
			state.id = userId;
			state.role = role;
		},
		logout(state) {
			state.loginStatus = false;
			state.accessToken = null;
			state.id = null;
			state.role = null;
		},
	},
});

export const { login, logout } = memberSlice.actions;
export default memberSlice.reducer;