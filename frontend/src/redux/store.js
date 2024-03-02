import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cartRedux';
import userReducer from './userRedux';
import paymentReducer from './paymentRedux';
import categorisReducer from './categoriesRedux';
import filtersRedux from './filtersRedux';

import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js';

const persistConfig = {
	key: 'root',
	// Add blocklist in production
	// blacklist: ['payment'],
	version: 1,
	storage: new CookieStorage(Cookies),
};

const rootReducer = combineReducers({
	user: userReducer,
	cart: cartReducer,
	payment: paymentReducer,
	categories: categorisReducer,
	filters: filtersRedux,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export const persistor = persistStore(store);
