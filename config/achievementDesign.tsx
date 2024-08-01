import Badge1 from '@/components/badges/Badge1';
import Badge2 from '@/components/badges/Badge2';
import { AchievementTemplate } from '@/config/definitions';

export const achievementDesigns: AchievementTemplate[] = [
	{
		id: 1,
		name: 'Badge1',
		colors: [
			{
				id: 1,
				main: 'bg-sky-600',
				accent: 'bg-sky-300',
				classNames: {
					outline: 'border-sky-300',
					emojiBg: 'bg-sky-100',
				},
			},
			{
				id: 2,
				main: 'bg-rose-600',
				accent: 'bg-rose-300',
				classNames: {
					outline: 'border-rose-300',
					emojiBg: 'bg-rose-100',
				},
			},
		],
		element: ({ emoji, primaryText, secondaryText, color }) => (
			<Badge1
				emoji={emoji}
				primaryText={primaryText}
				secondaryText={secondaryText}
				color={color}
			/>
		),
	},
	{
		id: 2,
		name: 'Badge2',
		colors: [
			{
				id: 1,
				main: 'bg-sky-600',
				accent: 'bg-sky-300',
				classNames: {
					outline: 'border-sky-300',
				},
			},
		],
		element: ({ emoji, primaryText, secondaryText, color }) => (
			<Badge2
				emoji={emoji}
				primaryText={primaryText}
				secondaryText={secondaryText}
				color={color}
			/>
		),
	},
];
