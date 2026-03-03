import type { MessageData } from '@entities';
import { LocalStorageService } from '@shared';

export const MESSAGES_KEY = 'messages';

class ChatLocalStorageService extends LocalStorageService {
	get messages(): MessageData[] {
		return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
	}
	set messages(messages: MessageData[]) {
		localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
	}
}

export const chatLocalStorageService = new ChatLocalStorageService();
