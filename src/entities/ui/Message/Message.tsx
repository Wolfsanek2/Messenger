import { cn, useAppDispatch, type ID } from '@shared';
import styles from './Message.module.scss';
import { chatActions } from '@pages/Chat/model';

interface MessageProps {
	className?: string;
	id: ID;
	text: string;
	time: string;
	authorName: string;
	isMine: boolean;
	isNew: boolean;
}

export const Message: React.FC<MessageProps> = ({
	id,
	text,
	isMine,
	className,
	authorName,
	time,
	isNew,
}) => {
	const dispatch = useAppDispatch();
	if (isNew) {
		setTimeout(() => dispatch(chatActions.removeIsNew(id)), 150);
	}
	return (
		<div
			className={cn(
				styles.message,
				className,
				isMine ? styles['message--mine'] : '',
			)}
			data-is-new={isNew}
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
