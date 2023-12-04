// Imports
import { ethers } from 'ethers';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';

// Setup ethers.js provider
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

// Create an Ethereum wallet
const wallet = ethers.Wallet.createRandom();

// Print the wallet information
console.log(wallet);
