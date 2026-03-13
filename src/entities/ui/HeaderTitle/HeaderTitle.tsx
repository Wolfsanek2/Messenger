import styles from './HeaderTitle.module.scss';
import { cn } from '@shared';
import type { FC, ReactNode } from 'react';

interface HeaderTitleProps {
	className?: string;
	children: ReactNode;
}

export const HeaderTitle: FC<HeaderTitleProps> = ({ className, children }) => {
	return (
		<span className={cn(className, styles['header-title'])}>
			{children}
		</span>
	);
};
