import { Button, cn } from '@shared';
import styles from './ChatInput.module.scss';
import { useRef, useState, type KeyboardEvent } from 'react';

import AttachmentIcon from '@shared/assets/icons/attachment.svg?react';

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
		<div className={cn(styles['input-container'], className)}>
			<input
				className={styles['input-container__input']}
				type="text"
				placeholder="Сообщение..."
				value={inputValue}
				onChange={onChange}
				ref={inputRef}
				onKeyDown={onKeyDown}
			/>
			<Button className={styles['input-container__attachment']}>
				<AttachmentIcon />
			</Button>
		</div>
	);
};
