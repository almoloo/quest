import Badge1 from '@/components/badges/Badge1';

export interface AchievementTemplateColor {
	id: number;
	main: string;
	accent: string;
	classNames: any;
}

export interface AchievementTemplate {
	id: number;
	name: string;
	colors: AchievementTemplateColor[];
	element: (data: {
		emoji: string;
		word: string;
		color: AchievementTemplateColor;
	}) => React.ReactNode;
}

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
		element: ({ emoji, word, color }) => (
			<Badge1
				emoji={emoji}
				word={word}
				color={color}
			/>
		),
	},
];
