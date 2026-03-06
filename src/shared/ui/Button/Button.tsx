import { cn } from '@shared/utils';
import styles from './Button.module.scss';
import type { FC, ReactNode } from 'react';

interface ButtonProps {
	children?: ReactNode;
	className?: string;
	onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ className, children, onClick }) => {
	return (
		<button className={cn(styles['button'], className)} onClick={onClick}>
			{children}
		</button>
	);
};
