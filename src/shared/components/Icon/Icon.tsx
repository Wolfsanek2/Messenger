import { cn } from '@shared/utils';
import styles from './Icon.module.scss';

interface IconProps {
	url: string;
	className?: string;
}

export const Icon: React.FC<IconProps> = ({ className, url }) => {
	return (
		<div className={cn(styles.iconContainer, className)}>
			<img src={url} className={styles.icon} />
		</div>
	);
};
