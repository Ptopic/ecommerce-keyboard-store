import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
	name: 'payment',
	initialState: {
		stripePromise: '',
		clientSecret: '',
		billingDetails: {},
		shippingDetails: {},
		tvrtka: '',
		tvrtkaDostava: '',
		oib: '',
		userId: '',
	},
	reducers: {
		setState: (state, action) => {
			state.stripePromise = action.payload.stripePromise;
			state.clientSecret = action.payload.clientSecret;
			state.billingDetails = action.payload.billingDetails;
			state.shippingDetails = action.payload.shippingDetails;
			state.tvrtka = action.payload.tvrtka;
			state.tvrtkaDostava = action.payload.tvrtkaDostava;
			state.oib = action.payload.oib;
			state.userId = action.payload.userId;
		},
		resetState: (state) => {
			state.stripePromise = '';
			state.clientSecret = '';
			state.billingDetails = {};
			state.shippingDetails = {};
			state.tvrtka = '';
			state.tvrtkaDostava = '';
			state.oib = '';
			state.userId = '';
		},
	},
});

export const { setState, resetState } = paymentSlice.actions;
export default paymentSlice.reducer;
