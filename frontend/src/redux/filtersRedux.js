import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
	name: 'filters',
	initialState: {
		filters: [],
		activeFilters: [],
	},
	reducers: {
		addFilter: (state, action) => {
			const objFilters = {};
			objFilters[action.payload.categoryName] = action.payload.filters;

			const objActiveFilters = {};
			objActiveFilters[action.payload.categoryName] =
				action.payload.activeFilters;

			state.filters.push(objFilters);
			state.activeFilters.push(objActiveFilters);
		},
		getFilter: (state, action) => {
			return state.initialState;
		},
		resetFilters: (state) => {
			state.filters = [];
		},
	},
});

export const { addFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
