import type { ChatData } from '@entities/Chat';
import { LocalStorageService } from '@shared';

export const CHATS_KEY = 'chats';

class ChatListLocalStorageService extends LocalStorageService {
	get chats(): ChatData[] {
		return JSON.parse(localStorage.getItem(CHATS_KEY) || '[]');
	}
	set chats(chats: ChatData[]) {
		localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
	}
}

export const chatListLocalStorageService = new ChatListLocalStorageService();
