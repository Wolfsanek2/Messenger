import styles from './EditProfile.module.scss';
import { cn } from '@shared';
import { Header, Input } from '@widgets/EditProfile';
import type { FC } from 'react';

interface EditProfileProps {
	className?: string;
}

export const EditProfile: FC<EditProfileProps> = ({ className }) => {
	return (
		<div className={cn(styles['edit-profile'], className)}>
			<Header />
			<div
				className={cn(
					styles['edit-profile__input-list'],
					styles['input-list'],
				)}
			>
				{[
					{ title: 'Полное имя', value: 'value' },
					{
						title: 'Username',
						value: 'value',
						description: 'Минимальная длина 5 символов',
					},
					{
						title: 'Bio',
						value: 'value',
						description: 'Любая информация о вас',
					},
				].map(({ title, value, description }, i) => {
					return (
						<Input
							key={i}
							className={styles['input-list__input']}
							title={title}
							value={value}
							description={description}
						/>
					);
				})}
			</div>
		</div>
	);
};
