import { createSlice } from '@reduxjs/toolkit';

const categoriesSlice = createSlice({
	name: 'categories',
	initialState: {
		data: [],
	},
	reducers: {
		setCategoriesArray: (state, action) => {
			console.log(action.payload);
			state.data = [...action.payload.categories];
		},
		resetCategories: (state) => {
			state.categories = [];
		},
	},
});

export const { setCategoriesArray, resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
