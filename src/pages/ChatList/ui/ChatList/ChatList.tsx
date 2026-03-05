import { Header, ChatList as ChatListInner } from '@widgets/ChatList';
import styles from './ChatList.module.scss';
import { useAppSelector } from '@shared';
import { chatListSelectors } from '@pages/ChatList/model';

import Edit from '@shared/assets/icons/edit.svg?react';

interface ChatListProps {
	className?: string;
}

export const ChatList: React.FC<ChatListProps> = () => {
	const chats = useAppSelector(chatListSelectors.chats);
	return (
		<div className={styles['chat-list']}>
			<Header className={styles['chat-list__header']} />
			<ChatListInner
				className={styles['chat-list__list']}
				chats={chats}
			/>
			<Edit className={styles['chat-list__edit']} />
		</div>
	);
};
