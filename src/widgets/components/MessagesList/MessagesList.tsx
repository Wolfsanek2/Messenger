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
		<div className={cn(styles['messages-lists'], className)}>
			{messages.map(
				({ id, text, isMine, authorName, createdAt, isNew }, index) => (
					<Message
						key={index}
						id={id}
						className={cn(
							styles['message'],
							isMine ? styles['message--mine'] : '',
						)}
						text={text}
						isMine={isMine}
						time={createdAt}
						authorName={authorName}
						isNew={isNew}
					/>
				),
			)}
		</div>
	);
};
