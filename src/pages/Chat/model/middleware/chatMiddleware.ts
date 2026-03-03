import type { RootState } from '@shared';
import type { Middleware } from 'redux';
import { chatActions, messagePayloadToMessageData } from '../slice';
import { chatLocalStorageService } from '../../services';

export const chatMiddleware: Middleware<{}, RootState> =
	() => (next) => (action) => {
		if (chatActions.addMessage.match(action)) {
			chatLocalStorageService.messages = [
				messagePayloadToMessageData(action.payload),
				...chatLocalStorageService.messages,
			];
		}
		next(action);
	};
