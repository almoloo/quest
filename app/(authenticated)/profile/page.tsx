'use client';

import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { abi } from '@/config/abi';
import { Suspense, useEffect, useState } from 'react';
import { Button, Form, Input, Space, Typography } from 'antd';
import { EditTwoTone, MinusCircleOutlined } from '@ant-design/icons';
import { Profile, ProfileInput } from '@/config/definitions';
import LoadingForm from '@/components/profile/LoadingForm';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Page = () => {
	const [form] = Form.useForm();
	const { address } = useAccount();

	const [initialFormData, setInitialFormData] = useState<Profile>({
		name: '',
		email: '',
		bio: '',
		avatarUrl: '',
		coverUrl: '',
		links: [],
	});

	// ----- GET PROFILE DATA -----
	const { data: profileData, isFetched: fetchedProfileData } =
		useReadContract({
			address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
			abi,
			functionName: 'getProfile',
			args: [address],
		});

	useEffect(() => {
		if (profileData) {
			const profile = profileData as ProfileInput;
			const links: string[] = JSON.parse(
				decodeURIComponent(profile.links)
			);
			setInitialFormData({
				...profile,
				links,
			});
		}
	}, [profileData]);

	// const { data: hash, writeContract, isPending } = useWriteContract();
	// const [formData, setFormData] = useState({
	// 	name: '',
	// 	email: '',
	// 	bio: '',
	// 	avatar: '',
	// 	cover: '',
	// 	links: '[]',
	// });
	// const [profile, setProfile] = useState('');

	// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	writeContract({
	// 		address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
	// 		abi,
	// 		functionName: 'setProfile',
	// 		args: [
	// 			formData.name,
	// 			formData.email,
	// 			formData.bio,
	// 			formData.avatar,
	// 			formData.cover,
	// 			formData.links,
	// 		],
	// 	});
	// };

	return (
		<>
			<div className="mb-5">
				<Title level={3}>
					{/* <EditOutlined color='' /> */}
					<EditTwoTone className="mr-4" />
					Edit Profile
				</Title>
				<Text>
					Edit your profile information. This information will be
					visible to other users.
				</Text>
			</div>
			{!fetchedProfileData ? (
				<LoadingForm />
			) : (
				<Form
					layout="vertical"
					fields={[
						{
							name: ['name'],
							value: initialFormData.name,
						},
						{
							name: ['email'],
							value: initialFormData.email,
						},
						{
							name: ['bio'],
							value: initialFormData.bio,
						},
						{
							name: ['links'],
							value: initialFormData.links,
						},
					]}
				>
					<Form.Item label="Wallet Address">
						<Input
							value={address}
							size="large"
							disabled
						/>
					</Form.Item>
					<Form.Item
						name="name"
						label="Name"
						validateTrigger="onBlur"
						hasFeedback
						rules={[
							{
								required: true,
								message: 'Please input your name!',
							},
							{
								min: 3,
								message:
									'Name must be at least 3 characters long',
							},
							{
								max: 20,
								message:
									'Name must be at most 20 characters long',
							},
						]}
						required
					>
						<Input
							placeholder="Your display name"
							size="large"
							autoComplete="full-name"
						/>
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						validateDebounce={300}
						hasFeedback
						rules={[
							{
								required: true,
								message: 'Please input your email!',
							},
							{
								type: 'email',
								message: 'Please input a valid email!',
							},
						]}
						required
					>
						<Input
							placeholder="Your email address"
							size="large"
							autoComplete="email"
						/>
					</Form.Item>
					<Form.Item
						name="bio"
						label="Bio"
						validateTrigger="onBlur"
						hasFeedback
						rules={[
							{
								max: 100,
								message:
									'Bio must be at most 100 characters long',
							},
						]}
						extra="Write a short bio about yourself. Share what you feel is important for others to know about you. This could include your interests, what you're studying, or your professional background."
					>
						<TextArea
							placeholder="A short description about yourself"
							autoSize={{ minRows: 4 }}
							size="large"
						/>
					</Form.Item>
					<Form.List
						name="links"
						initialValue={initialFormData.links.map((link) => ({
							link,
						}))}
					>
						{(fields, { add, remove }) => (
							<>
								{fields.map((field, index) => (
									<Form.Item
										{...field}
										label={index === 0 ? 'Links' : ''}
										key={field.key}
										validateTrigger={['onChange', 'onBlur']}
										rules={[
											{
												required: true,
												message:
													'Please input a link or delete this field.',
											},
											{
												type: 'url',
												message:
													'Please input a valid URL.',
											},
										]}
									>
										<Input
											placeholder="https://example.com"
											size="large"
											autoComplete="url"
											suffix={
												<MinusCircleOutlined
													onClick={() =>
														remove(field.name)
													}
												/>
											}
										/>
									</Form.Item>
								))}
								<Form.Item>
									<Button
										type="dashed"
										onClick={() => add()}
										block
										icon={<EditTwoTone />}
									>
										Add a Social Link
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
						>
							Save Changes
						</Button>
					</Form.Item>
				</Form>
			)}
			<pre>{JSON.stringify(initialFormData)}</pre>
			{/* {hash && <div>tx hash: {hash}</div>} */}
		</>
	);
};

export default Page;
