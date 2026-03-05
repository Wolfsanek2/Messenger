import { cn, PAGES_URLS } from '@shared';
import styles from './ChatHeader.module.scss';
import { UserInfo } from './UserInfo';
import { Link } from 'react-router';

import ArrowBackIcon from '@shared/assets/icons/arrow_back.svg?react';
import SearchIcon from '@shared/assets/icons/search.svg?react';
import MoreIcon from '@shared/assets/icons/more_vert.svg?react';

interface ChatHeaderProps {
	className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
	return (
		<div className={cn(className, styles['header'])}>
			<Link to={PAGES_URLS.CHAT_LIST} className={styles['header__back']}>
				<ArrowBackIcon />
			</Link>
			<UserInfo />
			<div className={styles['header__additional']}>
				<SearchIcon />
				<MoreIcon />
			</div>
		</div>
	);
};
