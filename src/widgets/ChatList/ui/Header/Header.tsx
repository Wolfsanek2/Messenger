import { Button, cn } from '@shared';
import styles from './Header.module.scss';

import BurgerIcon from '@shared/assets/icons/burger.svg?react';
import SearchIcon from '@shared/assets/icons/search.svg?react';
import { HeaderTitle } from '@entities';

interface HeaderProps {
	className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
	return (
		<div className={cn(className, styles['header'])}>
			<div
				className={cn(styles['left-part'], styles['header__left-part'])}
			>
				<Button className={styles['header__button']}>
					<BurgerIcon />
				</Button>
				<HeaderTitle className={styles['header__title']}>
					Messenger
				</HeaderTitle>
			</div>
			<Button className={styles['header__button']}>
				<SearchIcon />
			</Button>
		</div>
	);
};
