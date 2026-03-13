import styles from './BackButton.module.scss';
import { Button, cn, PAGES_URLS } from '@shared';
import type { FC } from 'react';
import { useNavigate } from 'react-router';

import ArrowBackIcon from '@shared/assets/icons/arrow_back.svg?react';

interface BackButtonProps {
	className?: string;
}

export const BackButton: FC<BackButtonProps> = ({ className }) => {
	const navigate = useNavigate();
	return (
		<Button
			className={cn(styles['back-button'], className)}
			onClick={() => navigate(PAGES_URLS.CHAT_LIST)}
		>
			<ArrowBackIcon />
		</Button>
	);
};
