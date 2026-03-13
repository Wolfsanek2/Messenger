const BASE_URL = '/Messenger';

export const ICONS_URLS = {
	ATTACHMENT: `${BASE_URL}/attachment.svg`,
	ARROW_BACK: `${BASE_URL}/arrow_back.svg`,
	SEARCH: `${BASE_URL}/search.svg`,
	MORE_VERT: `${BASE_URL}/more_vert.svg`,
};

export const PAGES_URLS = {
	CHAT_LIST: `${BASE_URL}`,
	CHAT_TEMPLATE: `${BASE_URL}/:id`,
	chat: (id: string) => `${BASE_URL}/${id}`,
	PROFILE: `${BASE_URL}/profile`,
};
