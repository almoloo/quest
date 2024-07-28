'use client';

import BadgeCreator from '@/components/dashboard/BadgeCreator';
import PageTitle from '@/components/layout/PageTitle';
import { abi } from '@/config/abi';
import { NFTMetadata, NFTMetadataAttribute } from '@/config/definitions';
import { convertIPFSHash, generateNFTMetadata } from '@/config/utils';
import { TrophyTwoTone } from '@ant-design/icons';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';

interface AchievementDataType {
	creator: `0x${string}`;
	url: string;
	transferable: boolean;
}

const Page = ({ params }: { params: { achievementId: string } }) => {
	const badgeRef = useRef<HTMLDivElement>(null);
	const { data: achievementData, isFetched: fetchedAchievementData } =
		useReadContract({
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
			abi,
			functionName: 'getAchievement',
			args: [params.achievementId],
		}) as { data: AchievementDataType; isFetched: boolean };
	const {
		data: submitHash,
		writeContract,
		isPending,
		isError,
		error,
	} = useWriteContract();

	const [achievementMetadata, setAchievementMetadata] =
		useState<NFTMetadata | null>(null);
	const [NFTTraits, setNFTTraits] = useState<NFTMetadataAttribute[]>([]);
	const [NFTName, setNFTName] = useState<string>('');
	const [NFTDescription, setNFTDescription] = useState<string>('');

	useEffect(() => {
		const fetchMetadata = async () => {
			const metadataUrl = convertIPFSHash(achievementData.url);
			const response = await fetch(metadataUrl);
			const metadata: NFTMetadata = await response.json();
			setAchievementMetadata(metadata);
		};
		if (achievementData && achievementData.url !== '') {
			fetchMetadata();
		}
	}, [achievementData]);

	useEffect(() => {
		if (achievementMetadata) {
			const parsedTraits = achievementMetadata.attributes.map((trait) => {
				if (trait.trait_type === 'themeId') {
					return {
						...trait,
						value: parseInt(trait.value),
					};
				} else if (trait.trait_type === 'badgeId') {
					return {
						...trait,
						value: parseInt(trait.value),
					};
				} else {
					return trait;
				}
			});
			setNFTName(achievementMetadata.name);
			setNFTDescription(achievementMetadata.description);
			setNFTTraits(achievementMetadata.attributes);
		}
	}, [achievementMetadata]);

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
				functionName: 'editAchievement',
				args: [parseInt(params.achievementId), nftMetadata, true],
			});
		} catch (error) {
			console.error('Failed:', error);
		}
	};

	return (
		<>
			<PageTitle
				title="Edit Achievement"
				description=""
				icon={<TrophyTwoTone />}
			/>
			<BadgeCreator
				badgeRef={badgeRef}
				setTraits={setNFTTraits}
				traits={NFTTraits}
			/>
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
			<div>{JSON.stringify(achievementData)}</div>
			<div>{JSON.stringify(achievementMetadata)}</div>
		</>
	);
};

export default Page;
