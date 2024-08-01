import React, { useEffect, useState } from 'react';
import { init } from 'emoji-mart';
import data from '@emoji-mart/data/sets/15/apple.json';
import Picker from '@emoji-mart/react';
import { achievementDesigns } from '@/config/achievementDesign';
import { Form, Input, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import {
	AchievementTemplate,
	AchievementTemplateColor,
	NFTMetadataAttribute,
} from '@/config/definitions';
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
	disabled?: boolean;
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
	const extraTabs = props.extraTabs || [];

	const handleTemplateChange = (id: number) => {
		const design = achievementDesigns.find((d) => d.id === id);
		if (design) {
			setCurrentDesign(design);
		}
	};

	const handleColorChange = (color: AchievementTemplateColor) => {
		const newColor = currentDesign?.colors.find((c) => c.id === color.id);
		setCurrentDesignColor(newColor || currentDesign?.colors[0] || null);
	};

	useEffect(() => {
		init({ data });
	}, []);

	useEffect(() => {
		if (props.traits) {
			const emojiTrait = props.traits.find(
				(trait) => trait.trait_type === 'emojiId'
			);
			const primaryTextTrait = props.traits.find(
				(trait) => trait.trait_type === 'primaryText'
			);
			const secondaryTextTrait = props.traits.find(
				(trait) => trait.trait_type === 'secondaryText'
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
			if (primaryTextTrait) {
				setPrimaryText(primaryTextTrait.value);
			}
			if (secondaryTextTrait) {
				setSecondaryText(secondaryTextTrait.value);
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
					currentDesign
						? currentDesign.colors.find(
								(c) => c.id === parseInt(themeTrait.value)
						  ) || currentDesign.colors[0]
						: null
				);
			}
		}
	}, [props.traits]);

	useEffect(() => {
		if (currentDesign) {
			setCurrentDesignColor(currentDesign.colors[0]);
		}
	}, [currentDesign]);

	useEffect(() => {
		props.setTraits([
			{
				trait_type: 'emojiId',
				value: emoji,
			},
			{
				trait_type: 'primaryText',
				value: primaryText,
			},
			{
				trait_type: 'secondaryText',
				value: secondaryText,
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
	}, [currentDesign, currentDesignColor, emoji, primaryText, secondaryText]);

	const tabItems: TabsProps['items'] = [
		...extraTabs!,
		{
			key: (extraTabs.length + 1).toString(),
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
			disabled: props.disabled || false,
		},
		{
			key: (extraTabs.length + 2).toString(),
			label: 'Colors',
			children: (
				<ColorsList
					colors={currentDesign?.colors || []}
					currentDesignColor={currentDesignColor}
					handleChange={handleColorChange}
				/>
			),
			icon: <HighlightTwoTone />,
			disabled: props.disabled || !currentDesign || false,
		},
		{
			key: (extraTabs.length + 3).toString(),
			label: 'Emoji',
			children: (
				<Picker
					data={data}
					onEmojiSelect={(emoji: any) => setEmoji(emoji.id)}
					theme="light"
					maxFrequentRows={0}
					previewPosition="none"
					set="apple"
					dynamicWidth={true}
				/>
			),
			icon: <SmileTwoTone />,
			disabled: props.disabled || !currentDesign || false,
		},
		{
			key: (extraTabs.length + 4).toString(),
			label: 'Text',
			children: (
				<Form layout="vertical">
					<Form.Item label="Primary Text">
						<Input
							value={primaryText}
							onChange={(e) => setPrimaryText(e.target.value)}
							size="large"
							disabled={props.disabled}
						/>
					</Form.Item>
					<Form.Item label="Secondary Text">
						<Input
							value={secondaryText}
							onChange={(e) => setSecondaryText(e.target.value)}
							size="large"
							disabled={props.disabled}
						/>
					</Form.Item>
				</Form>
			),
			icon: <EditTwoTone />,
			disabled: props.disabled || !currentDesign || false,
		},
	];

	return (
		<>
			<section className="checkeredBg flex items-center justify-center rounded-xl p-10 border min-h-[30vh]">
				<div ref={props.badgeRef}>
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
