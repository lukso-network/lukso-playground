import { ethers } from 'ethers';
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

// Connect to the mainnet or testnet
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

// Get the controller key of the Universal Profile
const controller = '0x...'; // Replace with the controller address

// Instantiate the profile contract with an address
const userProfileAddress = '0x...'; // Replace with the user's profile address
const myUniversalProfile = new ethers.Contract(userProfileAddress, UniversalProfile.abi, provider);

// Instantiate the token contract with an address
const tokenAddress = '0x...'; // Replace with the token contract address
const myToken = new ethers.Contract(tokenAddress, LSP7Mintable.abi, provider);

try {
  // Generate the calldata to token transfer
  const tokenCalldata = myToken.interface.encodeFunctionData('transfer', [
    '0x...', // Receiving address
    15, // Token amount
    false, // Force parameter
    '0x', // Additional data
  ]);

  // Call the execute function of the profile to send the LYX transaction
  // Will forward to the LSP6 Key Manager to check permissions of the controller
  const transaction = await myUniversalProfile.execute(
    0, // Operation of type CALL
    '0x...', // Recipient address including profiles and vaults
    0, // Amount in LYX
    tokenCalldata, // Contract calldata, empty for regular transfer
    { gasLimit: 500000, from: controller }, // Gas limit of the transaction and sender address
  );

  const txReceipt = await transaction.wait();
  console.log('Transaction hash:', txReceipt.transactionHash);
  console.log('Transaction successful.');
} catch (error) {
  console.error('Error:', error);
}
