import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
	name: 'filters',
	initialState: {
		filters: [],
		activeFilters: [],
	},
	reducers: {
		addFilter: (state, action) => {
			const { categoryName, filters, activeFilters } = action.payload;

			// Use immer to update the state immutably
			state.filters.push({ [categoryName]: filters });
			state.activeFilters.push({ [categoryName]: activeFilters });
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
