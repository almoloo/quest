import { Profile } from '@/config/definitions';

export const convertIPFSHash = (hash: string) => {
	return `https://ipfs.io/ipfs/${hash}`;
};
