import { abi } from '@/config/abi';
import { achievementDesigns } from '@/config/achievementDesign';
import { Achievement, ParsedAchievementMetadata } from '@/config/definitions';
import { convertIPFSHash, convertNFTMetadata } from '@/config/utils';
import { useCallback, useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import BadgeLoader from '@/components/dashboard/BadgeLoader';

interface ReceivedBadgeProps {
	badgeId: number;
	value: number;
}

const ReceivedBadge = ({ badgeId }: ReceivedBadgeProps) => {
	const [badgeInfo, setBadgeInfo] =
		useState<ParsedAchievementMetadata | null>(null);

	const { data: achievement, isFetched } = useReadContract({
		address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
		abi,
		functionName: 'getAchievement',
		args: [badgeId],
	}) as { data: Achievement; isFetched: boolean };

	const fetchMetadata = useCallback(async () => {
		const url = convertIPFSHash(achievement.url);
		const metadata = await fetch(url);
		const metadataJson = await metadata.json();
		const parsedMetadata = convertNFTMetadata(
			metadataJson,
			Number(achievement.id),
			achievement.transferable,
			achievement.url
		);
		setBadgeInfo(parsedMetadata);
	}, [achievement]);

	useEffect(() => {
		if (isFetched) {
			fetchMetadata();
		}
	}, [achievement]);

	const currentDesign = achievementDesigns.find(
		(design) => design.id === badgeInfo?.badgeId
	);
	const currentColor = currentDesign?.colors.find(
		(color) => color.id === badgeInfo?.themeId
	);

	return isFetched ? (
		<div className="checkeredBg rounded-xl border flex justify-center items-center relative p-10 grow">
			{currentDesign?.element({
				emoji: badgeInfo?.emojiId!,
				primaryText: badgeInfo?.primaryText!,
				secondaryText: badgeInfo?.secondaryText!,
				color: currentColor!,
			})}
		</div>
	) : (
		<BadgeLoader />
	);
};

export default ReceivedBadge;
