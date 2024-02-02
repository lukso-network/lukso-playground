import { ethers } from 'ethers';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

// Connect to the mainnet or testnet
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

// Get the controller key of the Universal Profile
const controller = '0x...'; // Replace with the controller address

// 💡 Request LYXt from the faucet:
// 🚰 https://faucet.testnet.lukso.network/

// Instantiate Universal Profile
const userProfileAddress = '0x...'; // Replace with the user's profile address
const myUniversalProfile = new ethers.Contract(
  userProfileAddress,
  UniversalProfile.abi,
  provider,
);

(async () => {
  try {
    // Call the execute function of the profile to send the LYX transaction
    // Will forward to the LSP6 Key Manager to check permissions of the controller
    const transaction = await myUniversalProfile.execute(
      0, // operation of type CALL
      '0x...', // recipient address including profiles and vaults
      ethers.parseEther('0.5'), // amount in LYX, converting to wei
      '0x...', // contract calldata, empty for regular transfer
      { gasLimit: 300000, from: controller }, // gas limit of the transaction and sender address
    );

    const txReceipt = await transaction.wait();
    console.log('Transaction hash:', txReceipt.transactionHash);
    console.log('Transaction successful.');
  } catch (error) {
    console.error('Error:', error);
  }
})();
