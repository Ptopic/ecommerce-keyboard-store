import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
	name: 'filters',
	initialState: {
		filters: [],
		activeFilters: [],
	},
	reducers: {
		addFilter: (state, action) => {
			// const filtersData = {};
			// filtersData['filters'] = action.payload.filters;
			// filtersData['activeFilters'] = action.payload.activeFilters;
			const objFilters = {};
			objFilters[action.payload.categoryName] = action.payload.filters;

			const objActiveFilters = {};
			objActiveFilters[action.payload.categoryName] =
				action.payload.activeFilters;

			state.filters.push(objFilters);
			state.activeFilters.push(objActiveFilters);
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
