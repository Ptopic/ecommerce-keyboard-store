import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		open: false,
		products: [],
		quantity: 0,
		totalPrice: 0,
	},
	reducers: {
		openCart: (state) => {
			state.open = true;
		},
		closeCart: (state) => {
			state.open = false;
		},
		resetCart: (state) => {
			state.open = false;
			(state.products = []), (state.quantity = 0), (state.totalPrice = 0);
		},
		addProduct: (state, action) => {
			console.log(action.payload);
			state.quantity += action.payload.quantity;
			state.products.push(action.payload);
			state.totalPrice += action.payload.price * action.payload.quantity;
		},
		removeProduct: (state, action) => {
			state.quantity -= action.payload.quantity;
			for (let i = 0; i < state.products.length; i++) {
				if (
					state.products[i]._id === action.payload.id &&
					state.products[i].color === action.payload.color
				) {
					state.products.splice(i, 1);
				}
			}
			state.totalPrice -= action.payload.price * action.payload.quantity;
		},
		incrementProductQuantity: (state, action) => {
			state.products = state.products.map((product) => {
				if (product._id === action.payload.id) {
					product.quantity += 1;
					state.quantity += 1;
					state.totalPrice += product.price;
				}
				return product;
			});
		},
		decrementProductQuantity: (state, action) => {
			state.products = state.products.map((product) => {
				if (product._id === action.payload.id) {
					product.quantity = product.quantity > 1 ? product.quantity - 1 : 1;
					state.quantity = state.quantity > 1 ? state.quantity - 1 : 1;
					state.totalPrice =
						state.totalPrice > product.price
							? state.totalPrice - product.price
							: product.price;
				}
				return product;
			});
		},
	},
});

export const {
	openCart,
	closeCart,
	resetCart,
	addProduct,
	removeProduct,
	incrementQuantity,
	decrementQuantity,
	incrementProductQuantity,
	decrementProductQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
