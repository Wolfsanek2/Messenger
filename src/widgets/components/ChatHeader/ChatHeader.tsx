import { cn, Icon, ICONS_URLS } from '@shared';
import styles from './ChatHeader.module.scss';
import { UserInfo } from './UserInfo';

interface ChatHeaderProps {
	className?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ className }) => {
	return (
		<div className={cn(className, styles.chatHeader)}>
			<Icon url={ICONS_URLS.ARROW_BACK} />
			<UserInfo />
			<div className={styles.headerAdditional}>
				<Icon url={ICONS_URLS.SEARCH} />
				<Icon url={ICONS_URLS.MORE_VERT} />
			</div>
		</div>
	);
};
