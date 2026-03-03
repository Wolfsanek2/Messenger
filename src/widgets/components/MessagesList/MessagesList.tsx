import { Message, type MessageData } from '@entities';
import styles from './MessagesList.module.scss';
import { cn } from '@shared';

interface MessageListProps {
	messages: MessageData[];
	className?: string;
}

export const MessagesList: React.FC<MessageListProps> = ({
	messages,
	className,
}) => {
	return (
		<div className={cn(styles.messagesLists, className)}>
			{messages.map(({ text, isMine, authorName, createdAt }, index) => (
				<div
					key={index}
					className={cn(
						styles.messageContainer,
						isMine ? styles.messageContainerMine : '',
					)}
				>
					<Message
						className={styles.message}
						text={text}
						isMine={isMine}
						time={createdAt}
						authorName={authorName}
					/>
				</div>
			))}
		</div>
	);
};
