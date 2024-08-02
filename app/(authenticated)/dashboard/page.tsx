'use client';

import React, { useEffect } from 'react';
import { abi } from '@/config/abi';
import { achievementDesigns } from '@/config/achievementDesign';
import {
	Achievement,
	NFTMetadata,
	ParsedAchievementMetadata,
} from '@/config/definitions';
import { convertIPFSHash } from '@/config/utils';
import { init } from 'emoji-mart';
import data from '@emoji-mart/data/sets/15/apple.json';
import { useAccount, useReadContract } from 'wagmi';
import Link from 'next/link';
import { Spin, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import AchievementItem from '@/components/dashboard/AchievementItem';
import BadgeLoader from '@/components/dashboard/BadgeLoader';

const convertNFTMetadata = (
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

const Page = () => {
	const { address } = useAccount();

	const { data: achievements, isFetched: fetchedAchievements } =
		useReadContract({
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
			abi,
			functionName: 'getNftsByCreator',
			args: [address],
		}) as { data: Achievement[]; isFetched: boolean };

	const [achievementsData, setAchievementsData] = React.useState<
		ParsedAchievementMetadata[]
	>([]);

	useEffect(() => {
		init({ data });
	}, []);

	useEffect(() => {
		if (fetchedAchievements && achievementsData.length === 0) {
			achievements.forEach(async (achievement) => {
				const achievementUrl = convertIPFSHash(achievement.url);
				const metadata = await fetch(achievementUrl);
				const metadataJson = await metadata.json();
				const parsedMetadata = convertNFTMetadata(
					metadataJson,
					Number(achievement.id),
					achievement.transferable,
					achievement.url
				);
				setAchievementsData((prev) => [...prev, parsedMetadata]);
			});
		}
	}, [fetchedAchievements]);

	const items: TabsProps['items'] = [
		{
			key: '1',
			label: 'Created Achievements',
			children: !fetchedAchievements ? (
				<BadgeLoader />
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
					{achievementsData.map((achievement) => (
						<AchievementItem achievement={achievement} />
					))}
				</div>
			),
		},
		{
			key: '2',
			label: 'Received Badges',
			children: (
				<>
					<div>2</div>
				</>
			),
		},
	];

	return (
		<>
			<Tabs
				defaultActiveKey="1"
				items={items}
			/>
		</>
	);
};

export default Page;
