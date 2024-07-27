'use client';

import { useRef, useState } from 'react';
import BadgeCreator from '@/components/dashboard/BadgeCreator';
import PageTitle from '@/components/layout/PageTitle';

import { TrophyTwoTone } from '@ant-design/icons';
import { Button } from 'antd';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';
import { NFTMetadataAttribute } from '@/config/definitions';
import { generateNFTMetadata } from '@/config/utils';
import { useWriteContract } from 'wagmi';
import { abi } from '@/config/abi';

// Save Badge as Image
const captureBadge = (badge: HTMLDivElement) => {
	if (badge) {
		toPng(badge).then((dataUrl) => {
			const a = document.createElement('a');
			a.href = dataUrl;
			a.download = 'badge.png';
			a.click();
		});
	}
};

const page = () => {
	const badgeRef = useRef<HTMLDivElement>(null);

	const [NFTTraits, setNFTTraits] = useState<NFTMetadataAttribute[]>([]);
	const [NFTName, setNFTName] = useState<string>('');
	const [NFTDescription, setNFTDescription] = useState<string>('');

	const {
		data: submitHash,
		writeContract,
		isPending,
		isError,
		error,
	} = useWriteContract();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// GET BADGE IMAGE
		try {
			const badgeDataUrl = await toPng(badgeRef.current!);
			const badgeBlob = await fetch(badgeDataUrl).then((res) =>
				res.blob()
			);
			const badgeFile = new File([badgeBlob], 'badge.png', {
				type: 'image/png',
			});
			const formData = new FormData();
			formData.append('file', badgeFile);
			const nftMetadata = await generateNFTMetadata(
				{
					name: NFTName,
					description: NFTDescription,
					attributes: NFTTraits,
					image: '',
				},
				formData
			);
			console.log('submitted');
			console.log(nftMetadata);

			writeContract({
				address: process.env
					.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
				abi,
				functionName: 'addAchievement',
				args: [nftMetadata, true],
			});
		} catch (error) {
			console.error('Failed:', error);
		}
	};

	return (
		<>
			<PageTitle
				title="Create Achievement"
				description="Create a new achievement for distribution."
				icon={<TrophyTwoTone />}
			/>
			{/* ----- ACHIEVEMENT DESIGNER ----- */}
			<BadgeCreator
				badgeRef={badgeRef}
				setTraits={setNFTTraits}
			/>
			<Button onClick={() => captureBadge(badgeRef.current!)}>
				Capture image
			</Button>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="name"
					onChange={(e) => setNFTName(e.target.value)}
					defaultValue={NFTName}
				/>
				<textarea
					placeholder="description"
					onChange={(e) => setNFTDescription(e.target.value)}
					defaultValue={NFTDescription}
				></textarea>
				<button type="submit">Create</button>
			</form>
			<div>SUBMIT HASH: {submitHash}</div>
			<div>isPending: {isPending && 'yes'}</div>
			<div>isError: {isError && JSON.stringify(error)}</div>
		</>
	);
};

export default page;
