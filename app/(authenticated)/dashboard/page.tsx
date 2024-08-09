'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { abi } from '@/config/abi';
import {
	Achievement,
	ParsedAchievementMetadata,
	UserTokensResponse,
} from '@/config/definitions';
import {
	convertIPFSHash,
	convertNFTMetadata,
	getUserTokens,
} from '@/config/utils';
import { init } from 'emoji-mart';
import data from '@emoji-mart/data/sets/15/apple.json';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import AchievementItem from '@/components/dashboard/AchievementItem';
import BadgeLoader from '@/components/dashboard/BadgeLoader';
import { TrophyOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ReceivedBadge from '@/components/dashboard/ReceivedBadge';

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
	const [receivedBadges, setReceivedBadges] = useState<
		UserTokensResponse[] | null
	>(null);

	const fetchReceivedBadges = useCallback(async () => {
		const data = await getUserTokens(address!);
		setReceivedBadges(data);
	}, [address]);

	useEffect(() => {
		init({ data });
	}, []);

	useEffect(() => {
		if (address) fetchReceivedBadges();
	}, [address]);

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
			icon: <UnorderedListOutlined />,
			children: !fetchedAchievements ? (
				<BadgeLoader />
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
					{achievementsData.map((achievement) => (
						<AchievementItem
							achievement={achievement}
							key={achievement.id}
						/>
					))}
				</div>
			),
		},
		{
			key: '2',
			label: 'Received Badges',
			icon: <TrophyOutlined />,
			children:
				receivedBadges === null ? (
					<BadgeLoader />
				) : receivedBadges?.length === 0 ? (
					<div>no badges</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
						{receivedBadges.map((badge) => (
							<ReceivedBadge
								badgeId={Number(badge.token_id)}
								value={Number(badge.value)}
								key={Number(badge.token_id)}
							/>
						))}
					</div>
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
