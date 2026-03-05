import { cn } from '@shared';
import styles from './Message.module.scss';

interface MessageProps {
	className?: string;
	text: string;
	time: string;
	authorName: string;
	isMine: boolean;
}

export const Message: React.FC<MessageProps> = ({
	text,
	isMine,
	className,
	authorName,
	time,
}) => {
	return (
		<div
			className={cn(
				styles.message,
				className,
				isMine ? styles['message--mine'] : '',
			)}
		>
			<div className={styles['message__author-name']}>{authorName}</div>
			<div className={styles['message__content']}>
				<div className={styles['message__text']}>{text}</div>
				<div className={styles['message__time']}>
					{new Date(time).toLocaleTimeString()}
				</div>
			</div>
		</div>
	);
};
