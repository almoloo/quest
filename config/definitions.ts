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

export interface UserTokensResponse {
	token: {
		address: `0x${string}`;
		circulating_market_cap: any;
		decimals: any;
		exchange_rate: any;
		holders: any;
		icon_url: any;
		name: any;
		symbol: any;
		total_supply: any;
		type: any;
		volume_24h: any;
	};
	token_id: string;
	token_instance: {
		animation_url: any;
		external_app_url: any;
		id: string;
		image_url: any;
		is_unique: any;
		metadata: any;
		owner: any;
		token: {
			address: `0x${string}`;
			circulating_market_cap: any;
			decimals: any;
			exchange_rate: any;
			holders: any;
			icon_url: any;
			name: any;
			symbol: any;
			total_supply: any;
			type: any;
			volume_24h: any;
		};
	};
	value: string;
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
