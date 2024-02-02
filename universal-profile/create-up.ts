import { LSPFactory } from '@lukso/lsp-factory.js';
import { ethers } from 'ethers';

// https://docs.lukso.tech/networks/testnet/parameters
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';
const CHAIN_ID = 4201; // LUKSO testnet
const PRIVATE_KEY = '0x...'; // Add the private key of your EOA from ../convenience/create-eoa.js

// Initialize ethers.js provider
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

// Create a wallet using the private key
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Initialize the LSPFactory with your EOA's wallet, which will deploy the UP smart contracts
const lspFactory = new LSPFactory(RPC_ENDPOINT, {
  chainId: CHAIN_ID,
});

// Deploy our Universal Profile
async function createUniversalProfile() {
  try {
    const deployedContracts = await lspFactory.UniversalProfile.deploy({
      controllerAddresses: [wallet.address], // our EOA that will be controlling the UP
      lsp3Profile: {
        name: 'My Universal Profile',
        description: 'My Cool Universal Profile',
        tags: ['Public Profile'],
        links: [
          {
            title: 'My Website',
            url: 'https://my-website.com',
          },
        ],
      },
    });

    const myUPAddress = deployedContracts.LSP0ERC725Account.address;
    console.log('My Universal Profile address:', myUPAddress);

    return deployedContracts;
  } catch (error) {
    console.error('Error creating Universal Profile:', error);
  }
}

createUniversalProfile();
