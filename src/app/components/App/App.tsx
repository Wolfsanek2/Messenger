import { Provider } from 'react-redux';
import styles from './App.module.scss';
import { Chat } from '@pages';
import { store } from '@app/store';

export const App = () => {
	return (
		<Provider store={store}>
			<div className={styles['app']}>
				<Chat className={styles['app__chat']} />
			</div>
		</Provider>
	);
};
