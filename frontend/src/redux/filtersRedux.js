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

			// Turn all sets of filters to arrays
			for (let filter of filters) {
				let arrayFromSet = Array.from(...Object.values(filter));
				filter[Object.keys(filter)] = arrayFromSet;
			}
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
