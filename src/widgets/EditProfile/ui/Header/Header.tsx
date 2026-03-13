import type { FC } from 'react';
import styles from './Header.module.scss';
import { cn } from '@shared';
import { BackButton, HeaderTitle } from '@entities';

interface HeaderProps {
	className?: string;
}

export const Header: FC<HeaderProps> = ({ className }) => {
	return (
		<header className={cn(className, styles['header'])}>
			<BackButton className={styles['header__button']} />
			<HeaderTitle>Редактировать профиль</HeaderTitle>
		</header>
	);
};
