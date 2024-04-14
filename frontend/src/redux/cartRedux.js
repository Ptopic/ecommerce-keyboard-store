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
			let productInCartId = null;
			// Check if product is in cart if it is just increment quantity of product
			for (let i = 0; i < state.products.length; i++) {
				if (state.products[i]._id === action.payload._id) {
					productInCartId = i;
				}
			}

			if (productInCartId != null) {
				state.products[productInCartId].quantity += action.payload.quantity;
				state.quantity += action.payload.quantity;
				let priceToAdd = action.payload.price * action.payload.quantity;
				let tempCartTotal =
					Number.parseFloat(state.totalPrice) + Number.parseFloat(priceToAdd);

				// New toFixed(2) state total price
				let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
				state.totalPrice += priceToAdd;
			} else {
				state.quantity += action.payload.quantity;
				state.products.push(action.payload);
				let priceToAdd = action.payload.price * action.payload.quantity;
				let tempCartTotal =
					Number.parseFloat(state.totalPrice) + Number.parseFloat(priceToAdd);

				// New toFixed(2) state total price
				let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
				state.totalPrice += priceToAdd;
			}
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
			let priceToRemove = action.payload.price * action.payload.quantity;
			let tempCartTotal =
				Number.parseFloat(state.totalPrice) - Number.parseFloat(priceToRemove);

			// New toFixed(2) state total price
			let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
			state.totalPrice -= priceToRemove;
		},
		incrementProductQuantity: (state, action) => {
			state.products = state.products.map((product) => {
				if (product._id === action.payload.id) {
					product.quantity += 1;
					state.quantity += 1;
					let priceChange = product.price * product.quantity;
					let tempCartTotal =
						Number.parseFloat(state.totalPrice) +
						Number.parseFloat(product.price);

					// New toFixed(2) state total price
					let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
					state.totalPrice += priceChange;
				}
				return product;
			});
		},
		decrementProductQuantity: (state, action) => {
			state.products = state.products.map((product) => {
				if (product._id === action.payload.id) {
					product.quantity = product.quantity > 1 ? product.quantity - 1 : 1;
					state.quantity = state.quantity > 1 ? state.quantity - 1 : 1;

					let priceChange = product.price * product.quantity;
					let tempCartTotal =
						state.totalPrice > product.price
							? state.totalPrice - product.price
							: product.price;

					// New toFixed(2) state total price
					let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
					state.totalPrice -= priceChange;
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
