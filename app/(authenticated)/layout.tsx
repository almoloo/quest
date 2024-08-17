'use client';

import { useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/config/store';
import { abi } from '@/config/abi';
import { ProfileInput } from '@/config/definitions';
import Link from 'next/link';
import Image from 'next/image';
import {
	EditTwoTone,
	HomeTwoTone,
	RightOutlined,
	SmileTwoTone,
	TrophyTwoTone,
} from '@ant-design/icons';
import { convertIPFSHash } from '@/config/utils';
import { Button } from 'antd';

const Layout = ({ children }: { children: React.ReactNode }) => {
	const {
		address,
		isDisconnected,
		isConnected,
		isConnecting,
		isReconnecting,
	} = useAccount();
	const router = useRouter();
	const userProfile: any = useProfileStore();

	const { data: profileData, isFetched: fetchedProfileData } =
		useReadContract({
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
			abi,
			functionName: 'getProfile',
			args: [address],
		}) as { data: ProfileInput; isFetched: boolean };

	useEffect(() => {
		if (
			!isConnecting &&
			!isReconnecting &&
			!isConnected &&
			isDisconnected
		) {
			router.push('/');
		}
	}, [isConnected, isDisconnected, isConnecting, isReconnecting, address]);

	useEffect(() => {
		if (
			profileData &&
			profileData?.name !== '' &&
			fetchedProfileData &&
			!userProfile.profile
		) {
			userProfile.setProfile(profileData);
		}
	}, [profileData, fetchedProfileData]);

	return isConnecting || isReconnecting ? (
		<section className="text-neutral-600 text-center p-5">
			Waiting for connection...
		</section>
	) : (
		<section className="lg:grow flex flex-col-reverse lg:grid lg:grid-cols-6 lg:container lg:mx-auto gap-5">
			<main className="lg:col-span-4 p-5">{children}</main>
			<aside className="lg:col-span-2 p-5">
				{userProfile.profile ? (
					<div className="flex items-center gap-3 mb-5">
						<Image
							src={convertIPFSHash(userProfile.profile.avatarUrl)}
							alt={userProfile.profile.name}
							width={50}
							height={50}
							className="rounded-full border"
						/>
						<div>
							<small className="block text-xs">
								Welcome back,
							</small>
							<strong className="text-xs">
								{userProfile.profile.name}
							</strong>
						</div>
						<div className="ml-auto">
							<Button
								type="link"
								size="small"
								onClick={() => router.push(`/u/${address}`)}
							>
								View Profile
							</Button>
						</div>
					</div>
				) : (
					'logged out'
				)}
				<div>
					<Link
						href="/dashboard"
						className="flex items-center gap-3 text-neutral-600 hover:text-sky-900 border hover:border-sky-200 hover:bg-sky-200/25 transition-colors border-b-0 p-3 rounded-t-lg"
					>
						<HomeTwoTone />
						<span className="mr-auto">Dashboard</span>
						<span className="text-sm text-neutral-400">
							<RightOutlined />
						</span>
					</Link>
					<Link
						href="/dashboard/profile"
						className="flex items-center gap-3 text-neutral-600 hover:text-sky-900 border hover:border-sky-200 hover:bg-sky-200/25 transition-colors border-b-0 p-3"
					>
						<EditTwoTone />
						<span className="mr-auto">Edit Profile</span>
						<span className="text-sm text-neutral-400">
							<RightOutlined />
						</span>
					</Link>
					<Link
						href="/dashboard/create"
						className="flex items-center gap-3 text-neutral-600 hover:text-sky-900 border hover:border-sky-200 hover:bg-sky-200/25 transition-colors p-3 rounded-b-lg"
					>
						<TrophyTwoTone />
						<span className="mr-auto">Create Badge</span>
						<span className="text-sm text-neutral-400">
							<RightOutlined />
						</span>
					</Link>
				</div>
			</aside>
		</section>
	);
};

export default Layout;
