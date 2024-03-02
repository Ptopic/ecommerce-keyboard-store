import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userRedux';
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
	version: 1,
	storage: new CookieStorage(Cookies, {
		// expiration: {
		// 	default: 100,
		// },
	}),
};

const rootReducer = combineReducers({ user: userReducer });

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
