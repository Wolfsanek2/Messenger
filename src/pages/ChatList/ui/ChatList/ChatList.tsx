import { Header, ChatList as ChatListInner } from '@widgets/ChatList';
import styles from './ChatList.module.scss';
import { Button, cn, useAppSelector } from '@shared';
import { chatListSelectors } from '@pages/ChatList/model';

import Edit from '@shared/assets/icons/edit.svg?react';

interface ChatListProps {
	className?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ className }) => {
	const chats = useAppSelector(chatListSelectors.chats);
	return (
		<div className={cn(styles['chat-list'], className)}>
			<Header className={styles['chat-list__header']} />
			<ChatListInner
				className={styles['chat-list__list']}
				chats={chats}
			/>
			<Button className={cn(styles['chat-list__edit'], styles['edit'])}>
				<Edit className={styles['edit__icon']} />
			</Button>
		</div>
	);
};
