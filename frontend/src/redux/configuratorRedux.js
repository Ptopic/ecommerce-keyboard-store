import { createSlice, current } from '@reduxjs/toolkit';

const configuratorSlice = createSlice({
	name: 'configuration',
	initialState: {
		open: false,
		displayType: '',
		categoryName: '',
		subCategory: '',
		configuration: {},
		Constraints: {},
		total: 0,
	},
	reducers: {
		openConfigurator: (state, action) => {
			state.open = true;
			state.displayType = action.payload.displayType;
			state.categoryName = action.payload.categoryName;
			state.subCategory = action.payload.subCategory;
		},
		closeConfigurator: (state) => {
			state.open = false;
			state.displayType = '';
			state.categoryName = '';
			state.subCategory = '';
		},
		addItemToConfiguration: (state, action) => {
			let product = action.payload.product;
			let subCategory = action.payload.subCategory;
			let categoryName = action.payload.categoryName;

			product['quantity'] = 1;
			let productDetails = Array.from(Object.keys(product.details));

			if (
				productDetails.includes('Podnožje') &&
				productDetails.includes('Vrsta Memorije') &&
				productDetails.includes('Veličina')
			) {
				state.Constraints['Podnožje'] = product.details['Podnožje'];
				state.Constraints['Vrsta Memorije'] = product.details['Vrsta Memorije'];
				state.Constraints['Veličina'] = product.details['Veličina'];
			} else if (
				productDetails.includes('Podnožje') ||
				productDetails.includes('Vrsta Memorije') ||
				productDetails.includes('Veličina')
			) {
				if (product.details['Podnožje']) {
					state.Constraints['Podnožje'] = product.details['Podnožje'];
				} else if (product.details['Vrsta Memorije']) {
					state.Constraints['Vrsta Memorije'] =
						product.details['Vrsta Memorije'];
				} else {
					state.Constraints['Veličina'] = product.details['Veličina'];
				}
			}

			let newConfiguratorValue = { ...state.configuration };

			if (subCategory) {
				if (newConfiguratorValue[subCategory] != null) {
					// Check if product is already in configuration
					for (let configurationProduct of newConfiguratorValue[subCategory]) {
						if (configurationProduct._id === product._id) {
							configurationProduct.quantity += 1;

							state.displayType = '';
							state.categoryName = '';
							state.open = false;

							state.configuration = newConfiguratorValue;
							state.total += product.price;
							return;
						}
					}

					newConfiguratorValue[subCategory] = [
						...Array.from(newConfiguratorValue[subCategory]),
						product,
					];
				} else {
					newConfiguratorValue[subCategory] = [product];
				}
			} else {
				if (newConfiguratorValue[categoryName]) {
					// Check if product is already in configuration
					for (let configurationProduct of newConfiguratorValue[categoryName]) {
						if (configurationProduct._id === product._id) {
							configurationProduct.quantity += 1;

							state.displayType = '';
							state.categoryName = '';
							state.open = false;

							state.configuration = newConfiguratorValue;
							state.total += product.price;
							return;
						}
					}

					newConfiguratorValue[categoryName] = [
						...Array.from(newConfiguratorValue[categoryName]),
						product,
					];
				} else {
					newConfiguratorValue[categoryName] = [product];
				}
			}

			state.displayType = '';
			state.categoryName = '';
			state.open = false;

			state.configuration = newConfiguratorValue;

			state.total += product.price * product.quantity;
		},
		removeItemFromConfiguration: (state, action) => {
			let newConfiguratorValues = { ...state.configuration };
			let categoryName = action.payload.categoryName;
			let id = action.payload.id;

			// Remove product constraints
			let rowItems = null;

			rowItems = Array.from(state.configuration[categoryName]);

			let product = rowItems[id];

			const filteredConfiguratorValues = Array.from(
				state.configuration[categoryName]
			).filter((_, index) => index != id);

			newConfiguratorValues[categoryName] = filteredConfiguratorValues;
			state.displayType = '';
			state.categoryName = '';
			state.open = false;

			state.total -= product.price * product.quantity;
			state.configuration = newConfiguratorValues;

			// Remove all constraints then remap them from remaining products (cpu, ram, motherboard or case)
			state.Constraints = {};

			// Get all products with constraints
			for (let category of Object.keys(newConfiguratorValues)) {
				if (
					category == 'Procesori' ||
					category == 'Matične ploče' ||
					category == 'Radna memorija (RAM)' ||
					category == 'Kućišta'
				) {
					let productsFromCategory = newConfiguratorValues[category];

					// Loop thru products
					for (let product of productsFromCategory) {
						let productDetails = Array.from(Object.keys(product.details));

						if (
							productDetails.includes('Podnožje') &&
							productDetails.includes('Vrsta Memorije') &&
							productDetails.includes('Veličina')
						) {
							state.Constraints['Podnožje'] = product.details['Podnožje'];
							state.Constraints['Vrsta Memorije'] =
								product.details['Vrsta Memorije'];
							state.Constraints['Veličina'] = product.details['Veličina'];
						} else if (
							productDetails.includes('Podnožje') ||
							productDetails.includes('Vrsta Memorije') ||
							productDetails.includes('Veličina')
						) {
							if (product.details['Podnožje']) {
								state.Constraints['Podnožje'] = product.details['Podnožje'];
							} else if (product.details['Vrsta Memorije']) {
								state.Constraints['Vrsta Memorije'] =
									product.details['Vrsta Memorije'];
							} else {
								state.Constraints['Veličina'] = product.details['Veličina'];
							}
						}
					}
				}
			}
		},
		incrementProductQuantity: (state, action) => {
			let product = action.payload.product;
			let subCategory = action.payload.subCategory;
			let categoryName = action.payload.categoryName;

			let newConfiguratorValue = { ...state.configuration };

			if (subCategory) {
				for (let configurationProduct of newConfiguratorValue[subCategory]) {
					if (configurationProduct._id === product._id) {
						configurationProduct.quantity += 1;
						state.total += product.price;
					}
				}
			} else {
				for (let configurationProduct of newConfiguratorValue[categoryName]) {
					if (configurationProduct._id === product._id) {
						configurationProduct.quantity += 1;
						state.total += product.price;
					}
				}
			}

			state.configuration = newConfiguratorValue;
		},
		decrementProductQuantity: (state, action) => {
			let product = action.payload.product;
			let subCategory = action.payload.subCategory;
			let categoryName = action.payload.categoryName;

			let newConfiguratorValue = { ...state.configuration };

			if (subCategory) {
				for (let configurationProduct of newConfiguratorValue[subCategory]) {
					if (configurationProduct._id === product._id) {
						if (configurationProduct.quantity > 1) {
							configurationProduct.quantity -= 1;
							state.total -= product.price;
						}
					}
				}
			} else {
				for (let configurationProduct of newConfiguratorValue[categoryName]) {
					if (configurationProduct._id === product._id) {
						if (configurationProduct.quantity > 1) {
							configurationProduct.quantity -= 1;
							state.total -= product.price;
						}
					}
				}
			}

			state.configuration = newConfiguratorValue;
		},
		resetConfiguration: (state) => {
			state.configuration = {};
			state.total = 0;
			state.Constraints = {};
			state.open = false;
			state.displayType = '';
			state.categoryName = '';
		},
	},
});

export const {
	openConfigurator,
	closeConfigurator,
	addItemToConfiguration,
	removeItemFromConfiguration,
	incrementProductQuantity,
	decrementProductQuantity,
	resetConfiguration,
} = configuratorSlice.actions;
export default configuratorSlice.reducer;
