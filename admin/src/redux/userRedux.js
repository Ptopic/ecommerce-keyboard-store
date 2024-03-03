import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'User',
	initialState: {
		currentUser: null,
		isFetching: false,
		error: false,
		activeScreen: '',
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
			state.error = true;
		},
		logout: (state) => {
			state.currentUser = null;
			state.isFetching = false;
			state.error = false;
		},
		setActiveScreen: (state, action) => {
			state.activeScreen = action.payload;
		},
		setUserData: (state, action) => {
			state.currentUser = action.payload;
		},
	},
});

export const {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	setActiveScreen,
	setUserData,
} = userSlice.actions;
export default userSlice.reducer;
