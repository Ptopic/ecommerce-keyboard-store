import { configureStore, combineReducers } from '@reduxjs/toolkit';

import userReducer from './userRedux';
import categoriesRedux from './categoriesRedux';

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
};

const rootReducer = combineReducers({
	user: userReducer,
	categories: categoriesRedux,
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
