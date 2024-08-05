'use client';

import AchievementBadge from '@/components/dashboard/AchievementBadge';
import { init } from 'emoji-mart';
import data from '@emoji-mart/data/sets/15/apple.json';
import PageTitle from '@/components/layout/PageTitle';
import { abi } from '@/config/abi';
import {
	Achievement,
	AchievementTemplate,
	AchievementTemplateColor,
	ParsedAchievementMetadata,
} from '@/config/definitions';
import { convertIPFSHash, convertNFTMetadata } from '@/config/utils';
import {
	CrownTwoTone,
	FileAddOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
	SendOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Alert, Button, Form, Input, message, Typography } from 'antd';
import type { FormProps } from 'antd';

const { Title } = Typography;

const Page = ({ params }: { params: { achievementId: string } }) => {
	const { address } = useAccount();
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();

	const { data: achievement, isFetched: fetchedAchievement } =
		useReadContract({
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
			abi,
			functionName: 'getAchievement',
			args: [params.achievementId],
		}) as { data: Achievement; isFetched: boolean };

	const [achievementData, setAchievementData] =
		React.useState<ParsedAchievementMetadata | null>(null);
	const [currentDesign, setCurrentDesign] =
		React.useState<AchievementTemplate | null>(null);
	const [currentColor, setCurrentColor] =
		React.useState<AchievementTemplateColor | null>(null);
	const [formSubmitting, setFormSubmitting] = useState(false);

	const {
		data: submitHash,
		writeContract,
		isPending,
		isError: isWriteError,
		error: writeError,
		failureReason,
	} = useWriteContract();

	useEffect(() => {
		const fetchAchievementData = async () => {
			const achievementUrl = convertIPFSHash(achievement.url);
			const metadata = await fetch(achievementUrl);
			const metadataJson = await metadata.json();
			const parsedMetadata = convertNFTMetadata(
				metadataJson,
				Number(achievement.id),
				achievement.transferable,
				achievement.url
			);
			setAchievementData(parsedMetadata);
		};
		if (fetchedAchievement && !achievementData) {
			fetchAchievementData();
		}
	}, [achievement]);

	useEffect(() => {
		init({ data });
	}, []);

	type fieldType = {
		recipients: string[];
	};

	const handleSubmit: FormProps<fieldType>['onFinish'] = async (values) => {
		const { recipients } = values;
		if (!recipients) {
			messageApi.error('Please enter a recipient address.');
			return;
		}
		if (recipients.length === 0) {
			messageApi.error('Please enter a recipient address.');
			return;
		}
		setFormSubmitting(true);
		try {
			if (recipients.length > 1) {
				const amounts = [];
				recipients.forEach(() => amounts.push(1));

				writeContract({
					address: process.env
						.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
					abi,
					functionName: 'sendAchievementMultiRecipient',
					args: [
						recipients,
						Number(params.achievementId),
						amounts,
						'',
					],
				});
			} else {
				writeContract({
					address: process.env
						.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
					abi,
					functionName: 'sendAchievement',
					args: [recipients[0], Number(params.achievementId), 1, ''],
				});
			}
		} catch (error) {
			console.error('Failed:', error);
			messageApi.error('Failed to send achievement');
		} finally {
			setFormSubmitting(false);
		}
	};

	return (
		<>
			{contextHolder}
			<PageTitle
				title="Award Achievement"
				description="Award this achievement to a user by entering their address. The achievement will be transferred to the user's wallet."
				icon={<CrownTwoTone />}
			/>

			{achievementData && (
				<section className="checkeredBg rounded-xl flex justify-center items-center p-10 mb-5">
					<AchievementBadge achievement={achievementData} />
				</section>
			)}

			<Form
				layout="vertical"
				onFinish={handleSubmit}
				disabled={formSubmitting || isPending}
			>
				<header className="flex justify-between mb-2">
					<Title level={5}>Recipients</Title>
					<Button
						type="link"
						icon={<FileAddOutlined />}
					>
						Import from CSV
					</Button>
				</header>
				<Form.List
					name="recipients"
					initialValue={['']}
				>
					{(fields, { add, remove }) => (
						<>
							{fields.map((field, index) => (
								<Form.Item
									{...field}
									key={field.key}
									rules={[
										{
											required: true,
											message:
												'Please enter a recipient address.',
										},
										{
											// CHECK IF VALID ETH ADDRESS
											pattern: /^0x[a-fA-F0-9]{40}$/,
											message:
												'Please enter a valid Wallet address.',
										},
									]}
								>
									<Input
										size="large"
										suffix={
											fields.length > 1 && (
												<MinusCircleOutlined
													onClick={() =>
														remove(field.name)
													}
												/>
											)
										}
									/>
								</Form.Item>
							))}
							<Form.Item>
								{isWriteError && (
									<div className="mb-5">
										<Alert
											message="Error"
											description="Failed to send achievement."
											type="error"
											showIcon
										/>
										<span>
											{JSON.stringify(writeError)}
											{JSON.stringify(failureReason)}
										</span>
									</div>
								)}
								{submitHash && (
									<div className="mb-5">
										<Alert
											message="Success"
											description="Achievement sent successfully."
											type="success"
											showIcon
										/>
									</div>
								)}
								<div className="flex justify-between">
									<Button
										type="primary"
										icon={<SendOutlined />}
										htmlType="submit"
										size="large"
										loading={formSubmitting || isPending}
									>
										Send Achievement
									</Button>
									<Button
										onClick={() => add()}
										type="link"
										icon={<PlusCircleOutlined />}
										size="large"
									>
										Add Recipient
									</Button>
								</div>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Form>
		</>
	);
};

export default Page;
