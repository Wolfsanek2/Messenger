type ID = string;

export interface MessageData {
	id: ID;
	text: string;
	authorName: string;
	createdAt: string;
	isMine: boolean;
}
