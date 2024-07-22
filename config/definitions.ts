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
