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
