/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.externals.push('pino-pretty', 'lokijs', 'encoding');
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'plum-adequate-angelfish-838.mypinata.cloud',
				port: '',
				pathname: '/ipfs/**',
			},
		],
	},
};

export default nextConfig;
