'use server';

export const uploadFileToIPFS = async (file: FormData) => {
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
		throw new Error('Failed to upload file to IPFS');
	}
	const json = await res.json();
	return json.IpfsHash;
};

export const uploadJSONToIPFS = async (json: object) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.PINATA_JWT}`,
		},
		body: JSON.stringify({
			pinataContent: json,
			pinataMetadata: {
				name: 'metadata.json',
			},
		}),
	};

	const res = await fetch(
		'https://api.pinata.cloud/pinning/pinJSONToIPFS',
		options
	);
	if (!res.ok) {
		throw new Error('Failed to upload JSON to IPFS');
	}
	const data = await res.json();
	return data.IpfsHash;
};
