import { NFTMetadata } from '@/config/definitions';
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
