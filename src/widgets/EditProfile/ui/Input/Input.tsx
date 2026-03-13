import { cn } from '@shared';
import styles from './Input.module.scss';
import type { FC } from 'react';

interface InputProps {
	className?: string;
	title: string;
	value: string;
	description?: string;
}

export const Input: FC<InputProps> = ({
	className,
	title,
	value,
	description,
}) => {
	return (
		<div className={cn(styles['input-container'], className)}>
			<div className={styles['input-container__main']}>
				<span className={styles['input-container__title']}>
					{title}
				</span>
				<input
					type="text"
					value={value}
					className={styles['input-container__input']}
				/>
			</div>
			<div className={styles['input-container__description']}>
				{description}
			</div>
		</div>
	);
};
