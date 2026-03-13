// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/attach', express.static(path.join(__dirname, 'uploads')));

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const hash = crypto
			.createHash('md5')
			.update(Date.now().toString() + file.originalname)
			.digest('hex');
		cb(null, hash + path.extname(file.originalname));
	},
});
const upload = multer({ storage });

// Хранилища данных (в реальном проекте - БД)
let users = [
	{
		user_id: 1,
		nick: 'john.doe',
		name: 'John Doe',
		avatar: 'avatars/default.png',
	},
	{
		user_id: 2,
		nick: 'jane.smith',
		name: 'Jane Smith',
		avatar: 'avatars/default.png',
	},
	{
		user_id: 3,
		nick: 'bob.wilson',
		name: 'Bob Wilson',
		avatar: 'avatars/default.png',
	},
];

let chats = [];
let messages = [];
let attachments = [];
let userChats = []; // связи пользователей с чатами
let readStatus = []; // статусы прочтения сообщений

// Вспомогательные функции
const generateId = () => Math.floor(Math.random() * 1000000);

const getUserFromCookie = (req) => {
	const userId = req.cookies.userId;
	return users.find((u) => u.user_id === userId);
};

// Проверка авторизации
const requireAuth = (req, res, next) => {
	const user = getUserFromCookie(req);
	if (!user) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	req.user = user;
	next();
};

// Логин
app.post('/login', (req, res) => {
	const { username } = req.body;
	const user = users.find((u) => u.nick === username || u.name === username);

	if (!user) {
		return res.status(401).json({ error: 'Invalid credentials' });
	}

	res.cookie('userId', user.user_id, {
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000,
	});
	res.json({ success: true, user });
});

// Логаут
app.post('/logout', (req, res) => {
	res.clearCookie('userId');
	res.json({ success: true });
});

// Поиск пользователей
app.get('/search_users', requireAuth, (req, res) => {
	const { query } = req.query;
	const limit = parseInt(req.query.limit) || 20;

	if (!query) {
		return res.status(400).json({ error: 'Query parameter is required' });
	}

	const filteredUsers = users
		.filter(
			(u) =>
				u.name.toLowerCase().includes(query.toLowerCase()) ||
				u.nick.toLowerCase().includes(query.toLowerCase()),
		)
		.slice(0, limit);

	res.json({ users: filteredUsers });
});

// Поиск среди чатов пользователя
app.get('/search_chats', requireAuth, (req, res) => {
	const { query } = req.query;
	const limit = parseInt(req.query.limit) || 20;

	if (!query) {
		return res.status(400).json({ error: 'Query parameter is required' });
	}

	const userChatIds = userChats
		.filter((uc) => uc.user_id === req.user.user_id)
		.map((uc) => uc.chat_id);

	const userChatsList = chats
		.filter((c) => userChatIds.includes(c.chat_id))
		.filter((c) => c.topic.toLowerCase().includes(query.toLowerCase()))
		.map((c) => {
			const userReadStatus = readStatus.filter(
				(rs) =>
					rs.chat_id === c.chat_id && rs.user_id === req.user.user_id,
			);
			const lastMessage = messages
				.filter((m) => m.chat_id === c.chat_id)
				.sort((a, b) => b.added_at - a.added_at)[0];

			return {
				...c,
				last_message: lastMessage ? lastMessage.content : '',
				new_messages: messages.filter(
					(m) =>
						m.chat_id === c.chat_id &&
						!userReadStatus.some(
							(rs) => rs.message_id === m.message_id,
						),
				).length,
			};
		})
		.slice(0, limit);

	res.json({ chats: userChatsList });
});

// Получение списка чатов пользователя
app.get('/list_chats', requireAuth, (req, res) => {
	const userChatIds = userChats
		.filter((uc) => uc.user_id === req.user.user_id)
		.map((uc) => uc.chat_id);

	const userChatsList = chats
		.filter((c) => userChatIds.includes(c.chat_id))
		.map((c) => {
			const userReadStatus = readStatus.filter(
				(rs) =>
					rs.chat_id === c.chat_id && rs.user_id === req.user.user_id,
			);
			const lastMessage = messages
				.filter((m) => m.chat_id === c.chat_id)
				.sort((a, b) => b.added_at - a.added_at)[0];

			return {
				...c,
				last_message: lastMessage ? lastMessage.content : '',
				last_message_time: lastMessage ? lastMessage.added_at : null,
				last_message_sender: lastMessage ? lastMessage.user_id : null,
				new_messages: messages.filter(
					(m) =>
						m.chat_id === c.chat_id &&
						!userReadStatus.some(
							(rs) => rs.message_id === m.message_id,
						),
				).length,
			};
		})
		.sort(
			(a, b) => (b.last_message_time || 0) - (a.last_message_time || 0),
		);

	res.json({ chats: userChatsList });
});

// Получение сообщений чата
app.get('/chats/:chatId/messages', requireAuth, (req, res) => {
	const chatId = parseInt(req.params.chatId);
	const limit = parseInt(req.query.limit) || 50;
	const before = req.query.before ? parseInt(req.query.before) : null;

	// Проверяем членство в чате
	const isMember = userChats.some(
		(uc) => uc.chat_id === chatId && uc.user_id === req.user.user_id,
	);
	if (!isMember) {
		return res
			.status(403)
			.json({ error: 'You are not a member of this chat' });
	}

	let chatMessages = messages.filter((m) => m.chat_id === chatId);

	if (before !== null) {
		chatMessages = chatMessages.filter((m) => m.message_id < before);
	}

	chatMessages = chatMessages
		.sort((a, b) => b.added_at - a.added_at)
		.slice(0, limit);

	// Добавляем информацию об аттачах к сообщениям
	const messagesWithAttachments = chatMessages.map((message) => ({
		...message,
		attachments: attachments.filter(
			(a) => a.message_id === message.message_id,
		),
	}));

	res.json({ messages: messagesWithAttachments });
});

// Создание персонального чата
app.post('/create_pers_chat', requireAuth, (req, res) => {
	const { user_id } = req.body;

	if (!user_id) {
		return res.status(400).json({ error: 'user_id is required' });
	}

	// Проверяем существование собеседника
	const otherUser = users.find((u) => u.user_id === user_id);
	if (!otherUser) {
		return res.status(404).json({ error: 'User not found' });
	}

	// Нельзя создать чат с самим собой
	if (user_id === req.user.user_id) {
		return res
			.status(400)
			.json({ error: 'Cannot create chat with yourself' });
	}

	// Проверяем существующий чат
	const existingChat = chats.find(
		(c) =>
			c.is_group_chat === false &&
			userChats.filter((uc) => uc.chat_id === c.chat_id).length === 2 &&
			userChats.some(
				(uc) =>
					uc.chat_id === c.chat_id && uc.user_id === req.user.user_id,
			) &&
			userChats.some(
				(uc) => uc.chat_id === c.chat_id && uc.user_id === user_id,
			),
	);

	if (existingChat) {
		return res.json({ chat: existingChat });
	}

	// Создаем новый чат
	const newChat = {
		chat_id: generateId(),
		is_group_chat: false,
		topic: otherUser.name,
		created_at: Math.floor(Date.now() / 1000),
	};

	chats.push(newChat);
	userChats.push(
		{
			user_id: req.user.user_id,
			chat_id: newChat.chat_id,
			joined_at: Math.floor(Date.now() / 1000),
		},
		{
			user_id: user_id,
			chat_id: newChat.chat_id,
			joined_at: Math.floor(Date.now() / 1000),
		},
	);

	res.status(201).json({ chat: newChat });
});

// Создание группового чата
app.post('/create_group_chat', requireAuth, (req, res) => {
	const { topic } = req.body;

	if (!topic) {
		return res.status(400).json({ error: 'topic is required' });
	}

	const newChat = {
		chat_id: generateId(),
		is_group_chat: true,
		topic,
		created_at: Math.floor(Date.now() / 1000),
		created_by: req.user.user_id,
	};

	chats.push(newChat);
	userChats.push({
		user_id: req.user.user_id,
		chat_id: newChat.chat_id,
		joined_at: Math.floor(Date.now() / 1000),
		role: 'admin',
	});

	res.status(201).json({ chat: newChat });
});

// Добавление участников в групповой чат
app.post('/add_members_to_group_chat', requireAuth, (req, res) => {
	const { chat_id, user_ids } = req.body;

	if (!chat_id || !user_ids || !Array.isArray(user_ids)) {
		return res
			.status(400)
			.json({ error: 'chat_id and user_ids array are required' });
	}

	const chat = chats.find((c) => c.chat_id === chat_id);
	if (!chat) {
		return res.status(404).json({ error: 'Chat not found' });
	}

	if (!chat.is_group_chat) {
		return res
			.status(400)
			.json({ error: 'Cannot add members to personal chat' });
	}

	// Проверяем, что текущий пользователь состоит в чате
	const isMember = userChats.some(
		(uc) => uc.chat_id === chat_id && uc.user_id === req.user.user_id,
	);
	if (!isMember) {
		return res
			.status(403)
			.json({ error: 'You are not a member of this chat' });
	}

	const now = Math.floor(Date.now() / 1000);
	const addedUsers = [];

	// Добавляем новых участников
	user_ids.forEach((userId) => {
		const user = users.find((u) => u.user_id === userId);
		if (user) {
			const exists = userChats.some(
				(uc) => uc.chat_id === chat_id && uc.user_id === userId,
			);
			if (!exists) {
				userChats.push({
					user_id: userId,
					chat_id,
					joined_at: now,
					added_by: req.user.user_id,
				});
				addedUsers.push(user);
			}
		}
	});

	res.json({
		success: true,
		added_users: addedUsers,
		message: `Added ${addedUsers.length} users to chat`,
	});
});

// Выход из группового чата
app.post('/leave_group_chat', requireAuth, (req, res) => {
	const { chat_id } = req.body;

	if (!chat_id) {
		return res.status(400).json({ error: 'chat_id is required' });
	}

	const chat = chats.find((c) => c.chat_id === chat_id);
	if (!chat) {
		return res.status(404).json({ error: 'Chat not found' });
	}

	if (!chat.is_group_chat) {
		return res.status(400).json({ error: 'Cannot leave personal chat' });
	}

	// Удаляем пользователя из чата
	const index = userChats.findIndex(
		(uc) => uc.chat_id === chat_id && uc.user_id === req.user.user_id,
	);
	if (index !== -1) {
		userChats.splice(index, 1);
	}

	res.json({ success: true, message: 'Left chat successfully' });
});

// Отправка сообщения в чат
app.post('/send_message', requireAuth, (req, res) => {
	const { chat_id, content, attach_id } = req.body;

	if (!chat_id || !content) {
		return res
			.status(400)
			.json({ error: 'chat_id and content are required' });
	}

	// Проверяем существование чата и членство пользователя
	const isMember = userChats.some(
		(uc) => uc.chat_id === chat_id && uc.user_id === req.user.user_id,
	);
	if (!isMember) {
		return res
			.status(403)
			.json({ error: 'You are not a member of this chat' });
	}

	// Проверяем существование attachment, если указан
	if (attach_id) {
		const attach = attachments.find((a) => a.attach_id === attach_id);
		if (!attach) {
			return res.status(404).json({ error: 'Attachment not found' });
		}
		if (attach.user_id !== req.user.user_id || attach.chat_id !== chat_id) {
			return res.status(403).json({
				error: 'Attachment does not belong to you or this chat',
			});
		}
	}

	const now = Math.floor(Date.now() / 1000);
	const newMessage = {
		message_id: generateId(),
		chat_id,
		user_id: req.user.user_id,
		content,
		added_at: now,
		edited_at: null,
	};

	messages.push(newMessage);

	// Привязываем attachment к сообщению, если есть
	if (attach_id) {
		const attach = attachments.find((a) => a.attach_id === attach_id);
		attach.message_id = newMessage.message_id;
	}

	// Добавляем автора сообщения в прочитавшие (он автоматически читает свои сообщения)
	readStatus.push({
		user_id: req.user.user_id,
		message_id: newMessage.message_id,
		chat_id,
		read_at: now,
	});

	res.status(201).json({ message: newMessage });
});

// Редактирование сообщения
app.put('/messages/:messageId', requireAuth, (req, res) => {
	const messageId = parseInt(req.params.messageId);
	const { content } = req.body;

	if (!content) {
		return res.status(400).json({ error: 'content is required' });
	}

	const message = messages.find((m) => m.message_id === messageId);
	if (!message) {
		return res.status(404).json({ error: 'Message not found' });
	}

	// Проверяем, что пользователь - автор сообщения
	if (message.user_id !== req.user.user_id) {
		return res
			.status(403)
			.json({ error: 'You can only edit your own messages' });
	}

	message.content = content;
	message.edited_at = Math.floor(Date.now() / 1000);

	res.json({ message });
});

// Удаление сообщения
app.delete('/messages/:messageId', requireAuth, (req, res) => {
	const messageId = parseInt(req.params.messageId);

	const messageIndex = messages.findIndex((m) => m.message_id === messageId);
	if (messageIndex === -1) {
		return res.status(404).json({ error: 'Message not found' });
	}

	const message = messages[messageIndex];

	// Проверяем, что пользователь - автор сообщения
	if (message.user_id !== req.user.user_id) {
		return res
			.status(403)
			.json({ error: 'You can only delete your own messages' });
	}

	// Удаляем сообщение
	messages.splice(messageIndex, 1);

	// Удаляем связанные readStatus
	const readStatusToRemove = readStatus.filter(
		(rs) => rs.message_id === messageId,
	);
	readStatusToRemove.forEach((rs) => {
		const index = readStatus.findIndex(
			(r) => r.message_id === rs.message_id && r.user_id === rs.user_id,
		);
		if (index !== -1) readStatus.splice(index, 1);
	});

	res.json({ success: true, message: 'Message deleted' });
});

// Прочтение сообщения
app.post('/read_message', requireAuth, (req, res) => {
	const { message_id } = req.body;

	if (!message_id) {
		return res.status(400).json({ error: 'message_id is required' });
	}

	const message = messages.find((m) => m.message_id === message_id);
	if (!message) {
		return res.status(404).json({ error: 'Message not found' });
	}

	// Проверяем членство в чате
	const isMember = userChats.some(
		(uc) =>
			uc.chat_id === message.chat_id && uc.user_id === req.user.user_id,
	);
	if (!isMember) {
		return res
			.status(403)
			.json({ error: 'You are not a member of this chat' });
	}

	// Не отмечаем как прочитанное свое сообщение
	if (message.user_id === req.user.user_id) {
		return res
			.status(400)
			.json({ error: 'Cannot mark your own message as read' });
	}

	// Добавляем запись о прочтении, если ее еще нет
	const alreadyRead = readStatus.some(
		(rs) => rs.message_id === message_id && rs.user_id === req.user.user_id,
	);

	if (!alreadyRead) {
		readStatus.push({
			user_id: req.user.user_id,
			message_id,
			chat_id: message.chat_id,
			read_at: Math.floor(Date.now() / 1000),
		});
	}

	// Получаем обновленный чат
	const chat = chats.find((c) => c.chat_id === message.chat_id);
	const userReadStatus = readStatus.filter(
		(rs) =>
			rs.chat_id === message.chat_id && rs.user_id === req.user.user_id,
	);
	const lastMessage = messages
		.filter((m) => m.chat_id === message.chat_id)
		.sort((a, b) => b.added_at - a.added_at)[0];

	const chatWithStats = {
		...chat,
		last_message: lastMessage ? lastMessage.content : '',
		last_message_time: lastMessage ? lastMessage.added_at : null,
		new_messages: messages.filter(
			(m) =>
				m.chat_id === message.chat_id &&
				!userReadStatus.some((rs) => rs.message_id === m.message_id),
		).length,
	};

	res.json({ chat: chatWithStats });
});

// Загрузка файла
app.post('/upload_file', requireAuth, upload.single('file'), (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'File is required' });
	}

	const { chat_id } = req.body;

	if (!chat_id) {
		return res.status(400).json({ error: 'chat_id is required' });
	}

	// Проверяем членство в чате
	const isMember = userChats.some(
		(uc) =>
			uc.chat_id === parseInt(chat_id) && uc.user_id === req.user.user_id,
	);
	if (!isMember) {
		return res
			.status(403)
			.json({ error: 'You are not a member of this chat' });
	}

	const newAttachment = {
		attach_id: generateId(),
		message_id: null,
		chat_id: parseInt(chat_id),
		user_id: req.user.user_id,
		type: req.file.mimetype.startsWith('image/') ? 'image' : 'file',
		url: `attach/${req.file.filename}`,
		filename: req.file.originalname,
		size: req.file.size,
		uploaded_at: Math.floor(Date.now() / 1000),
	};

	attachments.push(newAttachment);

	res.status(201).json({ attach: newAttachment });
});

// Получение информации о пользователе
app.get('/users/:userId', requireAuth, (req, res) => {
	const userId = parseInt(req.params.userId);
	const user = users.find((u) => u.user_id === userId);

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	// Исключаем чувствительную информацию (например, если бы она была)
	const { password, ...publicUser } = user;
	res.json({ user: publicUser });
});

// Получение информации о текущем пользователе
app.get('/me', requireAuth, (req, res) => {
	res.json({ user: req.user });
});

// Получение аттачей чата
app.get('/chats/:chatId/attachments', requireAuth, (req, res) => {
	const chatId = parseInt(req.params.chatId);
	const { type } = req.query;

	// Проверяем членство в чате
	const isMember = userChats.some(
		(uc) => uc.chat_id === chatId && uc.user_id === req.user.user_id,
	);
	if (!isMember) {
		return res
			.status(403)
			.json({ error: 'You are not a member of this chat' });
	}

	let chatAttachments = attachments.filter((a) => a.chat_id === chatId);

	if (type) {
		chatAttachments = chatAttachments.filter((a) => a.type === type);
	}

	res.json({ attachments: chatAttachments });
});

// Создаем директорию для uploads
if (!fs.existsSync('uploads')) {
	fs.mkdirSync('uploads');
}

// Обработка ошибок
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});

// 404 обработчик
app.use((req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Test users: john.doe, jane.smith, bob.wilson`);
});
