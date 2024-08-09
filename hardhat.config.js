require('dotenv').config();
require('@nomicfoundation/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: '0.8.20',
	networks: {
		opencampus: {
			url: `https://rpc.open-campus-codex.gelato.digital/`,
			accounts: [process.env.ACCOUNT_PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: {
			opencampus: process.env.ETHERSCAN_API_KEY,
		},
		customChains: [
			{
				network: 'opencampus',
				chainId: 656476,
				urls: {
					apiURL: 'https://opencampus-codex.blockscout.com/api',
					browserURL: 'https://opencampus-codex.blockscout.com',
				},
			},
		],
	},
};
