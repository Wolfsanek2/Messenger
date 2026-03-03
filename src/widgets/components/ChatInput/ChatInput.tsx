import { cn, Icon, ICONS_URLS } from '@shared';
import styles from './ChatInput.module.scss';
import { useRef, useState, type KeyboardEvent } from 'react';

interface ChatInputProps {
	className?: string;
	onEnter?: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ className, onEnter }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [inputValue, setInputValue] = useState('');
	const onChange = () => {
		setInputValue(inputRef.current!.value);
	};
	const onKeyDown = (event: KeyboardEvent) => {
		if (inputValue && onEnter && event.code === 'Enter') {
			onEnter(inputValue);
			setInputValue('');
		}
	};
	return (
		<div className={cn(styles.inputContainer, className)}>
			<input
				className={styles['input-container__input']}
				type="text"
				placeholder="Сообщение"
				value={inputValue}
				onChange={onChange}
				ref={inputRef}
				onKeyDown={onKeyDown}
			/>
			<Icon url={ICONS_URLS.ATTACHMENT} className={styles.attachment} />
		</div>
	);
};
