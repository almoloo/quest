import React from 'react';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/config/index';
import Web3ModalProvider from '@/config/context';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const Providers = ({ children }: { children: React.ReactNode }) => {
	const initialState = cookieToInitialState(config, headers().get('cookie'));
	console.log(initialState);
	return (
		<Web3ModalProvider initialState={initialState!}>
			<AntdRegistry>{children}</AntdRegistry>
		</Web3ModalProvider>
	);
};

export default Providers;
