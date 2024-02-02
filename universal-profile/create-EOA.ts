import { ethers } from 'ethers';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network/';

// Setup ethers.js provider
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

// Create an Ethereum wallet
const wallet = ethers.Wallet.createRandom();

// Print the private key and address
console.log('My private key is: ' + wallet.privateKey);
console.log('My address is: ' + wallet.address);

// Define and call the getBalance function
async function getBalance() {
  try {
    // Get the balance
    const balance = await provider.getBalance(wallet.address);

    // Convert the balance to ether and log it
    console.log('My balance: ' + ethers.formatEther(balance) + ' LYXt');
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}

getBalance();
