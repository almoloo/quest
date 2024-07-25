'use client';

import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { abi } from '@/config/abi';
import { Suspense, useEffect, useState } from 'react';
import {
	Button,
	Form,
	Input,
	Space,
	Typography,
	Upload,
	message,
	Alert,
	Spin,
} from 'antd';
import type { GetProp, UploadFile, UploadProps, FormProps } from 'antd';
import {
	EditTwoTone,
	MinusCircleOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import { Profile, ProfileInput } from '@/config/definitions';
import LoadingForm from '@/components/profile/LoadingForm';
import { uploadImageToIPFS } from '@/config/action';

const { Title, Text } = Typography;
const { TextArea } = Input;
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const Page = () => {
	const [form] = Form.useForm();
	const [messageApi, contextHolder] = message.useMessage();
	const { address } = useAccount();
	const {
		data: submitHash,
		writeContract,
		isPending,
		isError,
	} = useWriteContract();

	const [initialFormData, setInitialFormData] = useState<Profile>({
		name: '',
		email: '',
		bio: '',
		avatarUrl: '',
		coverUrl: '',
		links: [],
	});
	const [selectedAvatar, setSelectedAvatar] = useState<UploadFile[]>([]);
	const [selectedCover, setSelectedCover] = useState<UploadFile[]>([]);
	const [formSubmitting, setFormSubmitting] = useState(false);

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

			form.setFieldsValue({
				name: profile.name,
				email: profile.email,
				bio: profile.bio,
				links: links,
				avatarUrl: profile.avatarUrl,
				coverUrl: profile.coverUrl,
			});
		}
	}, [profileData]);

	// ----- HANDLE IMAGE UPLOAD -----
	const uploadAvatarProps: UploadProps = {
		beforeUpload: async (file: UploadFile) => {
			setSelectedAvatar([file]);
			return false;
		},
		onRemove: (file: UploadFile) => {
			setSelectedAvatar([]);
		},
		fileList: selectedAvatar,
	};
	const uploadCoverProps: UploadProps = {
		beforeUpload: async (file: UploadFile) => {
			setSelectedCover([file]);
			return false;
		},
		onRemove: (file: UploadFile) => {
			setSelectedCover([]);
		},
		fileList: selectedCover,
	};

	// ----- HANDLE FORM SUBMISSION -----
	type FieldType = {
		name: string;
		email: string;
		bio: string;
		avatarImage: any;
		avatarUrl: any;
		coverImage: any;
		coverUrl: any;
		links: string[];
	};
	const handleSubmit: FormProps<FieldType>['onFinish'] = async (values) => {
		setFormSubmitting(true);
		try {
			messageApi.destroy();
			messageApi.loading('Submitting Profile...', 0);
			// ----- AVATAR UPLOAD -----
			if (values.avatarImage) {
				messageApi.destroy();
				messageApi.loading('Uploading Avatar...', 0);
				const data = new FormData();
				data.append('file', values.avatarImage.file);

				const avatarUrl = await uploadImageToIPFS(data);
				values.avatarUrl = avatarUrl;
			}
			// ----- COVER UPLOAD -----
			if (values.coverImage) {
				messageApi.destroy();
				messageApi.loading('Uploading Cover...', 0);
				const data = new FormData();
				data.append('file', values.coverImage.file);

				const coverUrl = await uploadImageToIPFS(data);
				values.coverUrl = coverUrl;
			}
			writeContract({
				address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
				abi,
				functionName: 'setProfile',
				args: [
					values.name,
					values.email,
					values.bio,
					values.avatarUrl,
					values.coverUrl,
					JSON.stringify(values.links.map((link) => link)),
				],
			});
		} catch (error) {
			console.error('Failed:', error);
			messageApi.destroy();
			messageApi.error('Failed to submit profile');
		} finally {
			setFormSubmitting(false);
			messageApi.destroy();
		}
	};

	return (
		<>
			{contextHolder}
			<div className="mb-5">
				<Title level={3}>
					<EditTwoTone className="mr-4" />
					Edit Profile
				</Title>
				<Text>
					Edit your profile information. This information will be
					visible to other users.
				</Text>
			</div>
			<Spin
				spinning={!fetchedProfileData}
				size="large"
			>
				<Form
					layout="vertical"
					form={form}
					onFinish={handleSubmit}
					disabled={formSubmitting || isPending}
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
					<div className="grid grid-cols-2 gap-5">
						<Form.Item
							name="avatarImage"
							label="Avatar Image"
						>
							<Upload {...uploadAvatarProps}>
								<Button icon={<UploadOutlined />}>
									Select File
								</Button>
							</Upload>
						</Form.Item>
						<Form.Item
							name="avatarUrl"
							hidden
						>
							<Input />
						</Form.Item>
						<Form.Item
							name="coverImage"
							label="Cover Image"
						>
							<Upload {...uploadCoverProps}>
								<Button icon={<UploadOutlined />}>
									Select File
								</Button>
							</Upload>
						</Form.Item>
						<Form.Item
							name="coverUrl"
							hidden
						>
							<Input />
						</Form.Item>
					</div>
					{isError && (
						<div className="mb-5">
							<Alert
								message="Error"
								description="Failed to submit profile to the blockchain"
								type="error"
								showIcon
							/>
						</div>
					)}
					{submitHash && (
						<div className="mb-5">
							<Alert
								message="Success"
								description="Profile submitted successfully"
								type="success"
								showIcon
							/>
						</div>
					)}
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							size="large"
							loading={formSubmitting}
						>
							Save Changes
						</Button>
					</Form.Item>
				</Form>
			</Spin>
		</>
	);
};

export default Page;
