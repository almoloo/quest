'use server';

export const uploadImageToIPFS = async (file: FormData) => {
	const options = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.PINATA_JWT}`,
		},
		body: file,
	};

	const res = await fetch(
		'https://api.pinata.cloud/pinning/pinFileToIPFS',
		options
	);
	if (!res.ok) {
		throw new Error('Failed to upload image to IPFS');
	}
	const json = await res.json();
	return json.IpfsHash;
};
