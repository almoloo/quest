'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Home() {
	const { isConnected, isConnecting, isReconnecting } = useAccount();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (
			!isConnecting &&
			!isReconnecting &&
			isConnected &&
			pathname === '/'
		) {
			router.push('/dashboard');
		}
	}, [isConnected, isConnecting, isReconnecting]);

	return (
		<>
			{/* ----- HERO ----- */}
			<section>
				<h2>Create & Share Your Achievements as NFTs</h2>
				<span>
					Turn your accomplishments into unique digital badges and
					send them as NFTs to recognize others.
				</span>
			</section>
			{/* ----- FEATURES ----- */}
			<section>
				<h3>Why Choose Quest?</h3>
				<div>
					{/* ITEM */}
					<div>
						<h4>Customizable Templates</h4>
						<span>
							Choose from a variety of professionally designed
							templates to create your unique achievement badges.
						</span>
					</div>
					{/* ITEM */}
					<div>
						<h4>Easy Wallet Integration</h4>
						<span>
							Connect your digital wallet seamlessly and start
							creating and sending badges in minutes.
						</span>
					</div>
					{/* ITEM */}
					<div>
						<h4>Secure and Decentralized</h4>
						<span>
							Powered by blockchain, ensuring your badges are
							secure, authentic, and yours forever.
						</span>
					</div>
				</div>
			</section>
			{/* ----- HOW ----- */}
			<section>
				<h3>How It Works</h3>
			</section>
		</>
	);
}
