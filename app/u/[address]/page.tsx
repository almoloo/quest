'use client';

import { abi } from '@/config/abi';
import { ProfileInput } from '@/config/definitions';
import { convertIPFSHash } from '@/config/utils';
import {
	FacebookOutlined,
	GithubOutlined,
	InstagramOutlined,
	LinkedinOutlined,
	LinkOutlined,
	MailOutlined,
	TwitchOutlined,
	TwitterOutlined,
	XOutlined,
} from '@ant-design/icons';
import { Button, Spin } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useReadContract } from 'wagmi';

const Profile = ({ params }: { params: { address: string } }) => {
	const { data: profileData, isFetched: fetchedProfileData } =
		useReadContract({
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
			abi,
			functionName: 'getProfile',
			args: [params.address],
		}) as { data: ProfileInput; isFetched: boolean };

	return (
		<Spin spinning={!fetchedProfileData}>
			<div className="w-full md:grid md:grid-cols-12 p-10">
				<div className="md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 xl:col-span-6 xl:col-start-4">
					<section className="rounded-xl bg-neutral-50 border">
						<div className="rounded-xl bg-neutral-100 h-64 relative overflow-hidden">
							{fetchedProfileData && profileData.coverUrl && (
								<Image
									src={convertIPFSHash(profileData.coverUrl)}
									alt="Profile"
									layout="fill"
									objectFit="cover"
									className="w-full h-full"
								/>
							)}
						</div>
						<div className="flex items-center gap-3 p-5">
							{fetchedProfileData && profileData.avatarUrl && (
								<Image
									src={convertIPFSHash(profileData.avatarUrl)}
									alt="Avatar"
									width={80}
									height={80}
									className="w-20 h-20 rounded-full"
								/>
							)}
							<div className="flex flex-col gap-1 grow">
								<strong className="text-lg">
									{fetchedProfileData && profileData.name}
								</strong>
								<div className="flex items-center justify-between">
									<span className="text-sm text-neutral-700">
										{params.address.substring(0, 6)}...
										{params.address.substring(
											params.address.length - 6
										)}
									</span>
									{fetchedProfileData &&
										(profileData.links !== '[]' ||
											profileData.email !== '') && (
											<div className="flex items-center">
												{profileData.email !== '' && (
													<Link
														href={`mailto:${profileData.email}`}
														target="_blank"
														passHref
													>
														<Button
															icon={
																<MailOutlined />
															}
															type="link"
															title={
																profileData.email
															}
														/>
													</Link>
												)}
												{JSON.parse(
													profileData.links
												).map((link: string) => {
													let icon = <LinkOutlined />;
													if (
														link.includes(
															'instagram.com'
														)
													) {
														icon = (
															<InstagramOutlined />
														);
													} else if (
														link.includes(
															'twitter.com'
														)
													) {
														icon = (
															<TwitterOutlined />
														);
													} else if (
														link.includes(
															'https://x.com'
														) ||
														link.includes(
															'https://www.x.com'
														)
													) {
														icon = <XOutlined />;
													} else if (
														link.includes(
															'linkedin.com'
														)
													) {
														icon = (
															<LinkedinOutlined />
														);
													} else if (
														link.includes(
															'twitch.tv'
														)
													) {
														icon = (
															<TwitchOutlined />
														);
													} else if (
														link.includes(
															'facebook.com'
														)
													) {
														icon = (
															<FacebookOutlined />
														);
													} else if (
														link.includes(
															'github.com'
														)
													) {
														icon = (
															<GithubOutlined />
														);
													}
													return (
														<Link
															href={link}
															target="_blank"
															passHref
														>
															<Button
																icon={icon}
																type="link"
															/>
														</Link>
													);
												})}
											</div>
										)}
								</div>
							</div>
						</div>
						{fetchedProfileData && profileData.bio && (
							<div className="m-5 pt-5 mt-0 border-t text-neutral-700 text-sm">
								{profileData.bio}
							</div>
						)}
					</section>
				</div>
			</div>
		</Spin>
	);
};

export default Profile;
