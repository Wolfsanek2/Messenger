import { Provider } from 'react-redux';
import styles from './App.module.scss';
import { Chat, ChatList } from '@pages';
import { store } from '@app/store';
import { BrowserRouter, Route, Routes } from 'react-router';
import { PAGES_URLS } from '@shared';
import { EditProfile } from '@pages/EditProfile';

export const App = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<div className={styles['app']}>
					<Routes>
						<Route
							path={PAGES_URLS.CHAT_LIST}
							element={
								<ChatList className={styles['app__page']} />
							}
						></Route>
						<Route
							path={PAGES_URLS.CHAT_TEMPLATE}
							element={<Chat className={styles['app__page']} />}
						></Route>
						<Route
							path={PAGES_URLS.PROFILE}
							element={
								<EditProfile className={styles['app__page']} />
							}
						></Route>
					</Routes>
				</div>
			</BrowserRouter>
		</Provider>
	);
};
