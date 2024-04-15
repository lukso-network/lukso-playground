import { HardhatUserConfig } from 'hardhat/config';
import { config as LoadEnv } from 'dotenv';
import '@nomicfoundation/hardhat-toolbox';

LoadEnv();

const config: HardhatUserConfig = {
  solidity: {
    // Default compiler version for all contracts
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    luksoTestnet: {
      url: 'https://4201.rpc.thirdweb.com',
      chainId: 4201,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    luksoMainnet: {
      url: 'https://42.rpc.thirdweb.com',
      chainId: 42,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: 'no-api-key-needed',
    customChains: [
      {
        network: 'luksoTestnet',
        chainId: 4201,
        urls: {
          apiURL: 'https://api.explorer.execution.testnet.lukso.network/api',
          browserURL: 'https://explorer.execution.testnet.lukso.network/',
        },
      },
      {
        network: 'luksoMainnet',
        chainId: 42,
        urls: {
          apiURL: 'https://api.explorer.execution.mainnet.lukso.network/api',
          browserURL: 'https://explorer.execution.mainnet.lukso.network/',
        },
      },
    ],
  },
};

export default config;
