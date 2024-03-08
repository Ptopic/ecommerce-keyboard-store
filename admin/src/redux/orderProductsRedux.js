import { createSlice } from '@reduxjs/toolkit';

const orderProductsSlice = createSlice({
	name: 'orderProducts',
	initialState: {
		orderProducts: [],
		totalPrice: 0,
	},
	reducers: {
		addProductToOrder: (state, action) => {
			// Format product to other orders products format (for displaying in view order page)
			let productObj = {};
			productObj['productId'] = action.payload._id;
			productObj['price'] = action.payload.price;
			productObj['quantity'] = 1;
			productObj['originalProduct'] = action.payload;

			// Push new productObj to orderProducts array
			state.orderProducts.push(productObj);
			let priceToAdd = action.payload.price;
			let tempCartTotal =
				Number.parseFloat(state.totalPrice) + Number.parseFloat(priceToAdd);

			// New toFixed(2) state total price
			let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
			state.totalPrice = newCartTotal;
		},
		removeProductFromOrder: (state, action) => {
			const filteredOrderProducts = state.orderProducts.filter(
				(_, id) => id != action.payload.id
			);

			let priceToRemove = action.payload.price * action.payload.quantity;
			let tempCartTotal =
				Number.parseFloat(state.totalPrice) - Number.parseFloat(priceToRemove);

			// New toFixed(2) state total price
			let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
			state.totalPrice = newCartTotal;

			state.orderProducts = filteredOrderProducts;
		},
		setOrderProducts: (state) => {
			state.orderProducts = [];
		},
		incrementProductQuantity: (state, action) => {
			console.log(action.payload.id);
			state.orderProducts = state.orderProducts.map((product, index) => {
				if (index === action.payload.id) {
					product.quantity += 1;
					let tempCartTotal =
						Number.parseFloat(state.totalPrice) +
						Number.parseFloat(product.price);

					console.log(product.quantity);
					// New toFixed(2) state total price
					let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
					state.totalPrice = newCartTotal;
				}
				return product;
			});
		},
		decrementProductQuantity: (state, action) => {
			state.orderProducts = state.orderProducts.map((product, index) => {
				if (index === action.payload.id) {
					product.quantity = product.quantity > 1 ? product.quantity - 1 : 1;

					let tempCartTotal =
						state.totalPrice > product.price
							? state.totalPrice - product.price
							: product.price;

					// New toFixed(2) state total price
					let newCartTotal = Math.trunc(tempCartTotal * 100) / 100;
					state.totalPrice = newCartTotal;
				}
				return product;
			});
		},
		resetState: (state) => {
			state.orderProducts = [];
			state.totalPrice = 0;
		},
	},
});

export const {
	addProductToOrder,
	removeProductFromOrder,
	setOrderProducts,
	incrementProductQuantity,
	decrementProductQuantity,
	resetState,
} = orderProductsSlice.actions;
export default orderProductsSlice.reducer;
