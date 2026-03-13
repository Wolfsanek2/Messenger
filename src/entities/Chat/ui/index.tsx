import { Button, cn, PAGES_URLS } from '@shared';
import styles from './Chat.module.scss';
import type { ChatData } from '../model';
import { useNavigate } from 'react-router';

import Sent from '@shared/assets/icons/status_sent.svg?react';
import Read from '@shared/assets/icons/status_read.svg?react';

interface ChatProps {
	className?: string;
	chatData: ChatData;
}

export const Chat: React.FC<ChatProps> = ({ className, chatData }) => {
	const navigate = useNavigate();
	return (
		<Button
			onClick={() => navigate(PAGES_URLS.chat(chatData.id))}
			className={cn(className, styles['chat'])}
		>
			<div className={styles['chat__main']}>
				<div className={styles['chat__avatar-container']}>
					<img
						src={chatData.avatarURL}
						className={styles['chat__avatar']}
					/>
				</div>
				<div className={styles['chat__text']}>
					<div className={styles['chat__title']}>
						{chatData.title}
					</div>
					<div className={styles['chat__last-message']}>
						{chatData.lastMessage}
					</div>
				</div>
			</div>
			<div className={styles['chat__additional']}>
				<div className={styles['chat__time']}>
					{chatData.lastMessageTime}
				</div>
				{chatData.lastMessageStatus === 'sent' && (
					<Sent className={styles['chat__status']} />
				)}
				{chatData.lastMessageStatus === 'read' && (
					<Read className={styles['chat__status']} />
				)}
			</div>
		</Button>
	);
};
