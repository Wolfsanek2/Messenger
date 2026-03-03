import styles from './UserInfo.module.scss';
import { Icon } from '@shared';

export const UserInfo = () => {
	return (
		<div className={styles.userInfo}>
			<Icon className={styles.avatar} url="/Messenger/Котик.jpg" />
			<div className={styles.title}>
				<div className={styles.name}>Дженнифер</div>
				<div className={styles.description}>была 2 часа назад</div>
			</div>
		</div>
	);
};
