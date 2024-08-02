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
				main: 'bg-sky-400',
				accent: 'bg-rose-500',
				classNames: {
					gradient1: 'from-sky-400 to-sky-600',
					gradient2: 'from-sky-800 to-sky-950',
					gradient3: 'from-sky-500 to-sky-900',
					outline1: 'outline-sky-700',
					outline2: 'outline-sky-400',
					primary: 'bg-sky-400',
					accent: 'bg-rose-500',
				},
			},
			{
				id: 2,
				main: 'bg-cyan-900',
				accent: 'bg-red-600',
				classNames: {
					gradient1: 'from-cyan-800 to-cyan-950',
					gradient2: 'from-cyan-800 to-cyan-950',
					gradient3: 'from-cyan-400 to-cyan-900',
					outline1: 'outline-sky-700',
					outline2: 'outline-sky-400',
					primary: 'bg-sky-400',
					accent: 'bg-rose-500',
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
