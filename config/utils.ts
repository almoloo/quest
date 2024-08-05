import { NFTMetadata, ParsedAchievementMetadata } from '@/config/definitions';
import { uploadFileToIPFS, uploadJSONToIPFS } from './action';

export const convertIPFSHash = (hash: string) => {
	return `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${hash}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`;
};

export const generateNFTMetadata = async (
	metadata: NFTMetadata,
	image: FormData
) => {
	try {
		const imageHash = await uploadFileToIPFS(image);
		const newMetadata = {
			...metadata,
			image: imageHash,
		};
		// upload newMetadata to IPFS
		console.log('🎈', newMetadata);
		const metadataHash = await uploadJSONToIPFS(newMetadata);
		return metadataHash;
	} catch (error) {
		console.error(error);
	}
};

export const convertNFTMetadata = (
	metadata: NFTMetadata,
	id: number,
	transferable: boolean,
	url: string
): ParsedAchievementMetadata => {
	return {
		id,
		name: metadata.name,
		description: metadata.description,
		image: metadata.image,
		transferable,
		url,
		badgeId: Number(
			metadata.attributes.find(
				(attribute) => attribute.trait_type === 'badgeId'
			)?.value
		),
		themeId: Number(
			metadata.attributes.find(
				(attribute) => attribute.trait_type === 'themeId'
			)?.value
		),
		emojiId: metadata.attributes.find(
			(attribute) => attribute.trait_type === 'emojiId'
		)?.value!,
		primaryText: metadata.attributes.find(
			(attribute) => attribute.trait_type === 'primaryText'
		)?.value!,
		secondaryText: metadata.attributes.find(
			(attribute) => attribute.trait_type === 'secondaryText'
		)?.value!,
	};
};
