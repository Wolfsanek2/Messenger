import { Button, cn, PAGES_URLS } from '@shared';
import styles from './ChatHeader.module.scss';
import { UserInfo } from './UserInfo';
import { Link, useNavigate } from 'react-router';

import ArrowBackIcon from '@shared/assets/icons/arrow_back.svg?react';
import SearchIcon from '@shared/assets/icons/search.svg?react';
import MoreIcon from '@shared/assets/icons/more_vert.svg?react';

interface ChatHeaderProps {
	className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
	const navigate = useNavigate();
	return (
		<div className={cn(className, styles['header'])}>
			<Button
				className={cn(styles['header__back'], styles['header__button'])}
				onClick={() => navigate(PAGES_URLS.CHAT_LIST)}
			>
				<ArrowBackIcon />
			</Button>
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
