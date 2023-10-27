import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		currentUser: {},
		isFetching: false,
	},
	reducers: {
		loginStart: (state) => {
			state.isFetching = true;
		},
		loginSuccess: (state, action) => {
			state.isFetching = false;
			state.currentUser = action.payload;
		},
		loginFailure: (state) => {
			state.isFetching = false;
		},
		logout: (state) => {
			state.currentUser = [];
			state.isFetching = false;
		},
	},
});

export const { loginStart, loginSuccess, loginFailure, logout } =
	userSlice.actions;
export default userSlice.reducer;
