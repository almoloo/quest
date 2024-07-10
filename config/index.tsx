import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { defineChain } from 'viem';

export const walletConnectProjectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!walletConnectProjectId) {
	throw new Error('WalletConnect Project ID not set');
}

export const openCampusTestnet = defineChain({
	id: 656476,
	testnet: true,
	name: 'Open Campus Codex',
	rpcUrls: {
		default: { http: ['https://rpc.open-campus-codex.gelato.digital'] },
	},
	nativeCurrency: {
		name: 'EDU',
		symbol: 'EDU',
		decimals: 18,
	},
	blockExplorers: {
		default: {
			name: 'Open Campus Codex Explorer',
			url: 'https://opencampus-codex.blockscout.com/',
		},
	},
});

const metadata = {
	name: 'Quest',
	description: 'blockchain-powered achievement badges.',
	url:
		process.env.NODE_ENV === 'production'
			? 'https://quest.placeholder.rest'
			: 'http://localhost:3000',
	icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const config = defaultWagmiConfig({
	chains: [openCampusTestnet] as const,
	projectId: walletConnectProjectId,
	metadata,
	ssr: true,
	storage: createStorage({
		storage: cookieStorage,
	}),
});
