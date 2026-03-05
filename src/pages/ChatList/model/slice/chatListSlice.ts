import type { ChatData } from '@entities/Chat/model';
import { createSlice } from '@reduxjs/toolkit';
import { chatListLocalStorageService } from '../../services';

interface ChatListState {
	chats: ChatData[];
}

if (!chatListLocalStorageService.chats.length) {
	chatListLocalStorageService.chats = [
		{
			id: '1',
			avatarURL: '/Messenger/Котик.jpg',
			title: 'title1',
			lastMessage: 'lastMessage1',
			lastMessageTime: new Date().toLocaleTimeString(),
			lastMessageStatus: 'sent',
		},
		{
			id: '2',
			avatarURL: '/Messenger/Котик.jpg',
			title: 'title2',
			lastMessage: 'lastMessage2',
			lastMessageTime: new Date().toLocaleTimeString(),
			lastMessageStatus: 'read',
		},
	];
}

const initialState: ChatListState = {
	chats: chatListLocalStorageService.chats,
};

const slice = createSlice({
	name: 'chatList',
	initialState,
	reducers: {},
	selectors: {
		chats: (state) => state.chats,
	},
});

export const chatListReducer = slice.reducer;
export const chatListActions = slice.actions;
export const chatListSelectors = slice.selectors;
