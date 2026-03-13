import styles from './Chat.module.scss';
import { ChatHeader, ChatInput, MessagesList } from '@widgets';
import { cn, scrollToBottom, useAppDispatch, useAppSelector } from '@shared';
import { chatActions, chatSelectors } from '../model/slice';
import { useEffect, useState } from 'react';

interface ChatProps {
	className?: string;
}

export const Chat: React.FC<ChatProps> = ({ className }) => {
	const dispatch = useAppDispatch();
	const messages = useAppSelector(chatSelectors.selectMessages);

	const [isOnBottom, setIsOnBottom] = useState(true);

	useEffect(() => {
		addEventListener('scroll', () => {
			if (
				window.scrollY + window.outerHeight >=
				document.body.scrollHeight
			) {
				setIsOnBottom(true);
			} else {
				setIsOnBottom(false);
			}
		});
	}, []);

	useEffect(() => {
		if (isOnBottom) {
			scrollToBottom();
		}
	});
	return (
		<div className={cn(styles['chat'], className)}>
			<ChatHeader className={styles['chat__header']} />
			<MessagesList
				className={styles['chat__message-list']}
				messages={messages}
			/>
			<ChatInput
				className={styles['chat__input']}
				onEnter={(text) => {
					scrollToBottom();
					dispatch(chatActions.addMessage({ text, isMine: true }));
				}}
			/>
		</div>
	);
};
