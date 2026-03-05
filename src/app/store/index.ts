import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { chatReducer, chatMiddleware } from '@pages/Chat';
import { chatListReducer } from '@pages/ChatList/model';

export const rootReducer = combineReducers({
	chat: chatReducer,
	chatList: chatListReducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(chatMiddleware);
	},
});
