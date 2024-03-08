import { configureStore, combineReducers } from '@reduxjs/toolkit';

import userReducer from './userRedux';
import categoriesRedux from './categoriesRedux';
import filtersRedux from './filtersRedux';
import orderProductsRedux from './orderProductsRedux';

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
import storageSession from 'redux-persist/lib/storage/session';

const persistConfig = {
	key: 'root',
	version: 1,
	storage: storageSession,
	blacklist: ['orderProducts'],
};

const rootReducer = combineReducers({
	user: userReducer,
	categories: categoriesRedux,
	filters: filtersRedux,
	orderProducts: orderProductsRedux,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);
