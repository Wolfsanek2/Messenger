import { Button, cn } from '@shared';
import styles from './ChatHeader.module.scss';
import { UserInfo } from './UserInfo';
import { BackButton } from '@entities';

import SearchIcon from '@shared/assets/icons/search.svg?react';
import MoreIcon from '@shared/assets/icons/more_vert.svg?react';

interface ChatHeaderProps {
	className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
	return (
		<div className={cn(className, styles['header'])}>
			<BackButton
				className={cn(styles['header__back'], styles['header__button'])}
			/>
			<UserInfo />
			<div
				className={cn(
					styles['header__additional'],
					styles['additional'],
				)}
			>
				<Button
					className={cn(
						styles['additional__button'],
						styles['header__button'],
					)}
				>
					<SearchIcon />
				</Button>
				<Button
					className={cn(
						styles['additional__button'],
						styles['header__button'],
					)}
				>
					<MoreIcon />
				</Button>
			</div>
		</div>
	);
};
