import React, { useEffect, useState } from 'react';
import { init } from 'emoji-mart';
import data from '@emoji-mart/data/sets/15/apple.json';
import Picker from '@emoji-mart/react';
import {
	achievementDesigns,
	AchievementTemplate,
	AchievementTemplateColor,
} from '@/config/achievementDesign';
import { Form, Input, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { NFTMetadataAttribute } from '@/config/definitions';
import {
	AppstoreTwoTone,
	EditTwoTone,
	HighlightTwoTone,
	SmileTwoTone,
} from '@ant-design/icons';
import TemplatesList from '@/components/dashboard/TemplatesList';
import ColorsList from '@/components/dashboard/ColorsList';

interface BadgeCreatorProps {
	badgeRef: React.RefObject<HTMLDivElement>;
	setTraits: React.Dispatch<React.SetStateAction<NFTMetadataAttribute[]>>;
	traits?: NFTMetadataAttribute[];
	extraTabs?: TabsProps['items'];
}

const BadgeCreator = (props: BadgeCreatorProps) => {
	const [currentDesign, setCurrentDesign] =
		useState<AchievementTemplate | null>(null);
	const [currentDesignColor, setCurrentDesignColor] =
		useState<AchievementTemplateColor | null>(null);
	const [emoji, setEmoji] = useState<string>('+1');
	const [primaryText, setPrimaryText] = useState<string>('1UP!');
	const [secondaryText, setSecondaryText] = useState<string>(
		"You've unlocked a new achievement!"
	);

	const handleTemplateChange = (id: number) => {
		const design = achievementDesigns.find((d) => d.id === id);
		if (design) {
			setCurrentDesign(design);
		}
	};

	const handleColorChange = (color: AchievementTemplateColor) => {
		const design = achievementDesigns.find(
			(d) => d.id === currentDesign?.id
		);
		const newColor = design?.colors.find((c) => c.id === color.id);
		setCurrentDesignColor(newColor || design?.colors[0] || null);
	};

	useEffect(() => {
		init({ data });
	}, []);

	useEffect(() => {
		if (props.traits) {
			const emojiTrait = props.traits.find(
				(trait) => trait.trait_type === 'emojiId'
			);
			const textTrait = props.traits.find(
				(trait) => trait.trait_type === 'text'
			);
			const themeTrait = props.traits.find(
				(trait) => trait.trait_type === 'themeId'
			);
			const badgeTrait = props.traits.find(
				(trait) => trait.trait_type === 'badgeId'
			);
			if (emojiTrait) {
				setEmoji(emojiTrait.value);
			}
			if (textTrait) {
				setPrimaryText(textTrait.value);
			}
			if (badgeTrait) {
				setCurrentDesign(
					achievementDesigns.find(
						(d) => d.id === parseInt(badgeTrait.value)
					) || null
				);
			}
			if (themeTrait) {
				setCurrentDesignColor(
					achievementDesigns.find(
						(d) => d.id === parseInt(themeTrait.value)
					)?.colors[0]!
				);
			}
		}
	}, [props.traits]);

	useEffect(() => {
		if (currentDesign) {
			const design = achievementDesigns.find(
				(d) => d.id === currentDesign.id
			);
			if (design) {
				setCurrentDesignColor(design.colors[0]);
			}
		}
	}, [currentDesign]);

	useEffect(() => {
		props.setTraits([
			{
				trait_type: 'emojiId',
				value: emoji,
			},
			{
				trait_type: 'text',
				value: primaryText,
			},
			{
				trait_type: 'themeId',
				value: currentDesignColor?.id.toString() || '',
			},
			{
				trait_type: 'badgeId',
				value: currentDesign?.id.toString() || '',
			},
		]);
	}, [currentDesign, currentDesignColor, emoji, primaryText]);

	const tabItems: TabsProps['items'] = [
		// ...props.extraTabs!,
		{
			key: '1',
			label: 'Template',
			children: (
				<TemplatesList
					achievementDesigns={achievementDesigns}
					currentDesign={currentDesign}
					handleChange={handleTemplateChange}
					emoji={emoji}
					primaryText={primaryText}
					secondaryText={secondaryText}
				/>
			),
			icon: <AppstoreTwoTone />,
		},
		{
			key: '2',
			label: 'Colors',
			children: (
				<ColorsList
					colors={currentDesign?.colors || []}
					currentDesignColor={currentDesignColor}
					handleChange={handleColorChange}
				/>
			),
			icon: <HighlightTwoTone />,
		},
		{
			key: '3',
			label: 'Emoji',
			children: currentDesign ? (
				<Picker
					data={data}
					onEmojiSelect={(emoji: any) => setEmoji(emoji.id)}
					theme="light"
					maxFrequentRows={0}
					previewPosition="none"
					set="apple"
					dynamicWidth={true}
					style={{ width: '100%' }}
				/>
			) : (
				<div className="text-center text-neutral-500 py-10">
					Please select a template first.
				</div>
			),
			icon: <SmileTwoTone />,
		},
		{
			key: '4',
			label: 'Text',
			children: (
				<Form layout="vertical">
					<Form.Item label="Primary Text">
						<Input
							value={primaryText}
							onChange={(e) => setPrimaryText(e.target.value)}
							size="large"
						/>
					</Form.Item>
					<Form.Item label="Secondary Text">
						<Input
							value={secondaryText}
							onChange={(e) => setSecondaryText(e.target.value)}
							size="large"
						/>
					</Form.Item>
				</Form>
			),
			icon: <EditTwoTone />,
		},
	];

	return (
		<>
			{/* <input
						type="text"
						value={word}
						onChange={(e) => setWord(e.target.value)}
					/> */}
			<section className="checkeredBg rounded-xl p-10 border min-h-[30vh]">
				<div
					className="w-full h-full flex items-center justify-center"
					ref={props.badgeRef}
				>
					{currentDesign && (
						<>
							{currentDesign.element({
								emoji,
								primaryText: primaryText,
								secondaryText: secondaryText,
								color:
									currentDesignColor ||
									currentDesign.colors[0],
							})}
						</>
					)}
				</div>
			</section>
			<Tabs
				defaultActiveKey="1"
				items={tabItems}
				size="large"
			/>
		</>
	);
};

export default BadgeCreator;
