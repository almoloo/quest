'use client';

import {
	EditTwoTone,
	SafetyCertificateTwoTone,
	WalletTwoTone,
} from '@ant-design/icons';
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
			<section className="flex flex-col-reverse lg:grid lg:grid-cols-7 justify-center items-center">
				<div className="lg:col-span-3 lg:col-start-2 p-10 lg:p-0">
					<h2 className="font-black text-3xl leading-relaxed mb-2">
						Transform Your Achievements into Digital Badges
					</h2>
					<span className="font-serif text-lg text-neutral-600">
						Create, customize, and share achievement badges as NFTs
						with Quest.
					</span>
				</div>
				<div className="lg:col-span-2">
					<Image
						src={'/badge.png'}
						alt="Badge"
						width={400}
						height={400}
						className="drop-shadow-2xl"
					/>
				</div>
			</section>
			{/* ----- ABOUT ----- */}
			<section className="lg:grid lg:grid-cols-7 justify-center p-10 lg:p-0 mt-5 lg:mt-10">
				<div className="lg:col-span-5 lg:col-start-2">
					<h3 className="font-bold text-xl mb-2">About Quest</h3>
					<p className="text-neutral-800">
						Quest is a platform that allows you to immortalize your
						achievements by turning them into unique digital badges.
						Using blockchain technology, these badges can be
						customized, minted as NFTs, and shared with others,
						making your success story a part of the digital world.
					</p>
				</div>
			</section>
			{/* ----- FEATURES ----- */}
			<section className="lg:grid lg:grid-cols-7 justify-center p-10 lg:p-0 mt-5 lg:mt-10 mb-10">
				<div className="lg:col-span-5 lg:col-start-2">
					<h3 className="font-bold text-xl mb-2">
						Why Choose Quest?
					</h3>
					<div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 mt-5">
						{/* ITEM */}
						<div>
							<h4 className="font-bold mb-1">
								<EditTwoTone className="mr-2" />
								Customizable Templates
							</h4>
							<span className="text-sm text-neutral-600">
								Choose from a variety of professionally designed
								templates to create your unique achievement
								badges.
							</span>
						</div>
						{/* ITEM */}
						<div>
							<h4 className="font-bold mb-1">
								<WalletTwoTone className="mr-2" />
								Easy Wallet Integration
							</h4>
							<span className="text-sm text-neutral-600">
								Connect your digital wallet seamlessly and start
								creating and sending badges in minutes.
							</span>
						</div>
						{/* ITEM */}
						<div>
							<h4 className="font-bold mb-1">
								<SafetyCertificateTwoTone className="mr-2" />
								Secure and Decentralized
							</h4>
							<span className="text-sm text-neutral-600">
								Powered by blockchain, ensuring your badges are
								secure, authentic, and yours forever.
							</span>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
