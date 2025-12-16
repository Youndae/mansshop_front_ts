/*
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "@/app/rootReducer";

const persistConfig = {
	key: 'root',
	storage,
	blacklist: ['member'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: import.meta.env.DEV,
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;*/

import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "@/app/rootReducer.ts";

export const store = configureStore({
	reducer: rootReducer,
	devTools: import.meta.env.DEV,
});

export type AppDispatch = typeof store.dispatch;