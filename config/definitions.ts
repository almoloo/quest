export interface Profile {
	name: string;
	email: string;
	bio: string;
	avatarUrl: string;
	coverUrl: string;
	links: string[];
}

export interface ProfileInput {
	name: string;
	email: string;
	bio: string;
	avatarUrl: string;
	coverUrl: string;
	links: string;
}

export interface NFTMetadataAttribute {
	trait_type: string;
	value: string;
}

export interface NFTMetadata {
	name: string;
	description: string;
	image: string;
	attributes: NFTMetadataAttribute[];
}

export interface ParsedAchievementMetadata {
	id: number;
	name: string;
	description: string;
	image: string;
	transferable: boolean;
	url: string;
	badgeId: number;
	themeId: number;
	emojiId: string;
	primaryText: string;
	secondaryText: string;
}

export interface Achievement {
	creator: `0x${string}`;
	id: bigint;
	transferable: boolean;
	url: string;
}

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
		primaryText: string;
		secondaryText: string;
		color: AchievementTemplateColor;
	}) => React.ReactNode;
}

declare global {
	namespace React.JSX {
		interface IntrinsicElements {
			'em-emoji': EmojiAttributes;
		}

		interface EmojiAttributes {
			id: string;
			size: string;
			set: string;
			skin: number;
		}
	}
}
