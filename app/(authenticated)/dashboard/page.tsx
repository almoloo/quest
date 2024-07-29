'use client';

import { abi } from '@/config/abi';
import React from 'react';
import { useAccount, useReadContract } from 'wagmi';

const Page = () => {
	const { address } = useAccount();

	const { data: achievements, isFetched: fetchedAchievements } =
		useReadContract({
			address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}`,
			abi,
			functionName: 'getNftsByCreator',
			args: [address],
		});

	return (
		<div>
			Page
			<div>{JSON.stringify(achievements)}</div>
		</div>
	);
};

export default Page;
