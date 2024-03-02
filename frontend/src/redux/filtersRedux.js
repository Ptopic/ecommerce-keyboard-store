import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
	name: 'filters',
	initialState: {
		filters: [],
	},
	reducers: {
		addFilter: (state, action) => {
			const filtersData = {};
			filtersData['filters'] = action.payload.filters;
			filtersData['activeFilters'] = action.payload.activeFilters;
			const obj = {};
			obj[action.payload.categoryName] = filtersData;

			console.log(obj);
			state.filters = [...state.filters, obj];
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
