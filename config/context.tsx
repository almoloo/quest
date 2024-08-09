'use client';

import { config, walletConnectProjectId } from '@/config/index';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { State, WagmiProvider } from 'wagmi';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

if (!walletConnectProjectId) {
	throw new Error('WalletConnect Project ID not set');
}

createWeb3Modal({
	wagmiConfig: config,
	projectId: walletConnectProjectId,
});

export default function Web3ModalProvider({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState?: State;
}) {
	return (
		<WagmiProvider
			config={config}
			initialState={initialState}
		>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}
