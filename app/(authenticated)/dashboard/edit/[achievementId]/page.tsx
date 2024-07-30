'use client';

import BadgeCreator from '@/components/dashboard/BadgeCreator';
import PageTitle from '@/components/layout/PageTitle';
import { abi } from '@/config/abi';
import { NFTMetadata, NFTMetadataAttribute } from '@/config/definitions';
import { convertIPFSHash, generateNFTMetadata } from '@/config/utils';
import { InfoCircleTwoTone, TrophyTwoTone } from '@ant-design/icons';
import { Button, Form, Input, message, Spin, TabsProps } from 'antd';
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

interface AchievementDataType {
	creator: `0x${string}`;
	url: string;
	transferable: boolean;
}

const { TextArea } = Input;

const Page = ({ params }: { params: { achievementId: string } }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const { address } = useAccount();
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
		isSuccess,
	} = useWriteContract();

	const [loading, setLoading] = useState<boolean>(false);
	const [validation, setValidation] = useState({
		name: false,
		description: false,
		template: false,
	});
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
		if (
			achievementData &&
			achievementData.url !== '' &&
			achievementData.creator === address
		) {
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

	useEffect(() => {
		if (isSuccess) {
			messageApi.success('Achievement created successfully!');
		}
		if (isError) {
			messageApi.error('Failed to create achievement.');
			console.error('Error:', error);
		}
	}, [isSuccess, isError]);

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		// GET BADGE IMAGE
		try {
			setLoading(true);
			// VALIDATE
			if (!NFTName) {
				setValidation({ ...validation, name: true });
				throw new Error('Please fill in the achievement name.');
			}
			if (!NFTDescription) {
				setValidation({ ...validation, description: true });
				throw new Error('Please fill in the achievement description.');
			}
			if (
				NFTTraits.find((trait) => trait.trait_type === 'badgeId')
					?.value === ''
			) {
				setValidation({ ...validation, template: true });
				throw new Error('Please select a badge template.');
			}

			// GENERATE BADGE IMAGE
			const badgeDataUrl = await toPng(badgeRef.current!);
			const badgeBlob = await fetch(badgeDataUrl).then((res) =>
				res.blob()
			);
			const badgeFile = new File([badgeBlob], 'badge.png', {
				type: 'image/png',
			});
			const formData = new FormData();
			formData.append('file', badgeFile);

			// GENERATE METADATA
			const nftMetadata = await generateNFTMetadata(
				{
					name: NFTName,
					description: NFTDescription,
					attributes: NFTTraits,
					image: '',
				},
				formData
			);

			writeContract({
				address: process.env
					.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
				abi,
				functionName: 'editAchievement',
				args: [parseInt(params.achievementId), nftMetadata, true],
			});
		} catch (error: any) {
			console.error('Failed:', error);
			messageApi.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const formTabItem: TabsProps['items'] = [
		{
			key: '1',
			label: 'Achievement Info',
			children: (
				<Form
					layout="vertical"
					disabled={isPending || loading}
				>
					<Form.Item label="Achievement Name">
						<Input
							value={NFTName}
							onChange={(e) => setNFTName(e.target.value)}
							size="large"
							count={{ max: 32 }}
							status={validation.name ? 'error' : ''}
						/>
					</Form.Item>
					<Form.Item label="Achievement Description">
						<TextArea
							value={NFTDescription}
							onChange={(e) => setNFTDescription(e.target.value)}
							size="large"
							rows={4}
							count={{ max: 256 }}
							status={validation.description ? 'error' : ''}
						/>
					</Form.Item>
				</Form>
			),
			icon: <InfoCircleTwoTone />,
			disabled: isPending || loading,
		},
	];

	return (
		<>
			{contextHolder}
			<PageTitle
				title="Edit Achievement"
				description="Edit your achievement with a new name, description, and badge."
				icon={<TrophyTwoTone />}
			/>
			<Spin
				spinning={!fetchedAchievementData}
				size="large"
			>
				<BadgeCreator
					badgeRef={badgeRef}
					setTraits={setNFTTraits}
					traits={NFTTraits}
					extraTabs={formTabItem}
					disabled={isPending || loading}
				/>
				<div>
					<Button
						type="primary"
						onClick={handleSubmit}
						loading={isPending || loading}
						size="large"
					>
						Create Achievement
					</Button>
				</div>
			</Spin>
		</>
	);
};

export default Page;
