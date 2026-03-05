import type { ID } from '@shared';

type MessageStatus = 'sent' | 'read';

export interface ChatData {
	id: ID;
	avatarURL: string;
	title: string;
	lastMessage: string;
	lastMessageTime: string;
	lastMessageStatus: MessageStatus;
}
