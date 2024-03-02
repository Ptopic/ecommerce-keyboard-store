import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
	name: 'filters',
	initialState: {
		filters: [],
	},
	reducers: {
		addFilter: (state, action) => {
			state.data = [...state.data, action.payload];
		},
		getFilter: (state, action) => {
			return state.data;
		},
		resetFilters: (state) => {
			state.filters = [];
		},
	},
});

export const { addFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
