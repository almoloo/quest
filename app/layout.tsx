import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/config/index';
import Web3ModalProvider from '@/config/context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Quest',
	description: 'blockchain-powered achievement badges.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const initialState = cookieToInitialState(config, headers().get('cookie'));
	return (
		<html lang="en">
			<body className={inter.className}>
				<Web3ModalProvider initialState={initialState!}>
					<AntdRegistry>
						<Header />
						<main>{children}</main>
						<Footer />
					</AntdRegistry>
				</Web3ModalProvider>
			</body>
		</html>
	);
}
