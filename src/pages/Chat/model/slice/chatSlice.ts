import type { MessageData } from '@entities';
import { chatLocalStorageService, MESSAGES_KEY } from '@pages/Chat/services';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ID } from '@shared';

interface ChatSliceState {
	messages: MessageData[];
}

if (!chatLocalStorageService.has(MESSAGES_KEY)) {
	chatLocalStorageService.messages = [
		{
			id: crypto.randomUUID(),
			text: 'Чужое сообщение 1',
			authorName: 'Дженнифер',
			createdAt: new Date().toISOString(),
			isMine: false,
			isNew: false,
		},
		{
			id: crypto.randomUUID(),
			text: 'Чужое сообщение 2',
			authorName: 'Дженнифер',
			createdAt: new Date().toISOString(),
			isMine: false,
			isNew: true,
		},
	];
}

const initialState: ChatSliceState = {
	messages: chatLocalStorageService.messages,
};

interface MessagePayload {
	text: string;
	isMine: boolean;
}

export const messagePayloadToMessageData = (
	payload: MessagePayload,
): MessageData => {
	return {
		...payload,
		id: crypto.randomUUID(),
		authorName: 'my name',
		createdAt: new Date().toISOString(),
		isNew: true,
	};
};

const slice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		addMessage: (state, action: PayloadAction<MessagePayload>) => {
			state.messages = [
				messagePayloadToMessageData(action.payload),
				...state.messages,
			];
		},
		removeIsNew: (state, action: PayloadAction<ID>) => {
			const message = state.messages.find(
				(message) => message.id === action.payload,
			);
			if (message) {
				message.isNew = false;
			}
		},
	},
	selectors: {
		selectMessages: (state) => state.messages,
	},
});

export const chatReducer = slice.reducer;
export const chatActions = slice.actions;
export const chatSelectors = slice.selectors;
