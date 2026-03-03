import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { chatReducer, chatMiddleware } from '@pages/Chat';

export const rootReducer = combineReducers({
	chat: chatReducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(chatMiddleware);
	},
});
