import { Chat, type ChatData } from '@entities/Chat';
import { cn } from '@shared';
import styles from './ChatList.module.scss';

interface ChatListProps {
	className?: string;
	chats: ChatData[];
}

export const ChatList: React.FC<ChatListProps> = ({ className, chats }) => {
	return (
		<div className={cn(className, styles['chat-list'])}>
			{chats.map((chatData, i) => {
				return (
					<Chat
						className={styles['chat-list__chat']}
						chatData={chatData}
						key={i}
					/>
				);
			})}
		</div>
	);
};
