import React, { useEffect, useState } from 'react';
import { init } from 'emoji-mart';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
	achievementDesigns,
	AchievementTemplateColor,
} from '@/config/achievementDesign';
import { Button } from 'antd';
import { NFTMetadataAttribute } from '@/config/definitions';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'em-emoji': EmojiAttributes;
		}

		interface EmojiAttributes {
			id: string;
			size: string;
			set: string;
			skin: number;
		}
	}
}

interface BadgeCreatorProps {
	badgeRef: React.RefObject<HTMLDivElement>;
	setTraits: React.Dispatch<React.SetStateAction<NFTMetadataAttribute[]>>;
}

const EmojiIcon = (props: { id: string }) => (
	<>
		<em-emoji
			id={props.id}
			size="1.5em"
			set="native"
			skin={1}
		></em-emoji>
	</>
);

const BadgeCreator = (props: BadgeCreatorProps) => {
	const [currentDesign, setCurrentDesign] = useState<number | null>(null);
	const [currentDesignColor, setCurrentDesignColor] =
		useState<AchievementTemplateColor | null>(null);
	const [emoji, setEmoji] = useState<string>('+1');
	const [word, setWord] = useState<string>('Death Wish');
	const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

	const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = parseInt(e.target.value);
		const design = achievementDesigns.find((d) => d.id === id);
		if (design) {
			setCurrentDesign(design.id);
		}
	};

	const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const color = e.target.value;
		const design = achievementDesigns.find((d) => d.id === currentDesign);
		setCurrentDesignColor(
			design?.colors.find((c) => c.id === parseInt(color))!
		);
	};

	useEffect(() => {
		init({ data });
	}, []);

	useEffect(() => {
		if (currentDesign) {
			const design = achievementDesigns.find(
				(d) => d.id === currentDesign
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
				value: word,
			},
			{
				trait_type: 'themeId',
				value: currentDesignColor?.id.toString() || '',
			},
			{
				trait_type: 'badgeId',
				value: currentDesign?.toString() || '',
			},
		]);
	}, [currentDesign, currentDesignColor, emoji, word]);

	return (
		<>
			<div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2">
				<section className="order-2 lg:order-1 rounded-b-xl lg:rounded-b-none lg:rounded-l-xl border">
					<select onChange={handleTemplateChange}>
						<option
							value=""
							disabled
							selected
						></option>
						{achievementDesigns.map((design) => (
							<option
								key={design.id}
								value={design.id}
							>
								{design.name}
							</option>
						))}
					</select>
					<select onChange={handleColorChange}>
						{currentDesign &&
							achievementDesigns.map((design) => {
								if (design.id === currentDesign) {
									return design.colors.map((color) => {
										return (
											<option
												key={color.id}
												value={color.id}
											>
												{color.main}
											</option>
										);
									});
								}
							})}
					</select>
					<Button
						size="large"
						onClick={() => setIsPickerOpen(!isPickerOpen)}
						icon={<EmojiIcon id="+1" />}
					>
						Pick Emoji
					</Button>
					{isPickerOpen && (
						<Picker
							data={data}
							onEmojiSelect={(emoji: any) => setEmoji(emoji.id)}
							theme="light"
						/>
					)}
					<input
						type="text"
						value={word}
						onChange={(e) => setWord(e.target.value)}
					/>
				</section>
				<section className="checkeredBg rounded-t-xl lg:rounded-l-none lg:rounded-r-xl order-1 lg:order-2 p-10 aspect-square border border-b-0 lg:border-l-0 lg:border-b">
					<div
						className="w-full h-full flex items-center justify-center"
						ref={props.badgeRef}
					>
						{currentDesign && (
							<>
								{achievementDesigns.map((design) => {
									if (design.id === currentDesign) {
										return design.element({
											emoji,
											word: word,
											color:
												currentDesignColor ||
												design.colors[0],
										});
									}
								})}
							</>
						)}
					</div>
				</section>
			</div>
		</>
	);
};

export default BadgeCreator;
