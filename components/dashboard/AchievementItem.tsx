import { achievementDesigns } from '@/config/achievementDesign';
import { ParsedAchievementMetadata } from '@/config/definitions';
import { convertIPFSHash } from '@/config/utils';
import { CloudDownloadOutlined, SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';

interface AchievementItemProps {
	achievement: ParsedAchievementMetadata;
}

const AchievementItem = ({ achievement }: AchievementItemProps) => {
	const currentDesign = achievementDesigns.find(
		(design) => design.id === achievement.badgeId
	);
	const currentColor = currentDesign?.colors.find(
		(color) => color.id === achievement.themeId
	);

	return (
		<div className="relative flex">
			<Link
				href={`/dashboard/edit/${achievement.id}`}
				className="flex flex-col border rounded-xl overflow-hidden text-inherit hover:text-inherit hover:border-sky-400 transition-colors"
				key={achievement.id}
			>
				<div className="checkeredBg aspect-square flex justify-center items-center relative p-10 grow">
					{currentDesign?.element({
						emoji: achievement.emojiId,
						primaryText: achievement.primaryText,
						secondaryText: achievement.secondaryText,
						color: currentColor!,
					})}
				</div>
				<div className="p-5 shrink">
					<h3 className="text-lg font-bold text-neutral-700">
						{achievement.name}
					</h3>
					<p className="font-light line-clamp-1">
						{achievement.description}
					</p>
				</div>
				{/* 
			<div>
				<strong>image: </strong>
				{achievement.image}
			</div>
			<div>
				<strong>url: </strong>
				{achievement.url}
			</div>
			<div>
				<strong>transferable: </strong>
				{achievement.transferable ? 'true' : 'false'}
			</div>
			
			<Link href={`/dashboard/edit/${achievement.id}`}>Edit</Link> */}
			</Link>
			<div className="absolute top-4 left-4 flex items-start gap-2">
				<Link
					href={`/dashboard/send/${achievement.id}`}
					passHref
				>
					<Button
						icon={<SendOutlined />}
						onClick={(e) => e.stopPropagation()}
						type="primary"
					>
						Award to User
					</Button>
				</Link>
				<Link
					href={convertIPFSHash(achievement.image)}
					target="_blank"
					passHref
				>
					<Button
						icon={<CloudDownloadOutlined />}
						onClick={(e) => e.stopPropagation()}
					/>
				</Link>
			</div>
		</div>
	);
};

export default AchievementItem;
