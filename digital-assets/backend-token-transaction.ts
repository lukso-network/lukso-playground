import { ethers } from 'ethers';
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

//should be in the smart contracts folder

// Connect to the testnet
const RPC_ENDPOINT = 'https://4201.rpc.thirdweb.com';

const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

//const [deployer] = await provider.getSigner();

// Get the controller key of the Universal Profile
const controller = '0xf23b50eC5a208785ca6aEd9649D5e4403b173284'; // Replace with the controller address

// Instantiate the profile contract with an address
const userProfileAddress = '0x001a8B69b2bA0D990118C454f172cbA8EFEcA054'; // Replace with the user's profile address
const myUniversalProfile = new ethers.Contract(
  userProfileAddress,
  UniversalProfile.abi,
  provider,
);

// Instantiate the token contract with an address
const tokenAddress = '0xa90C580604e687507F2B4ED7dF6f1f80Dbbd3e9f'; // Replace with the token contract address
const myToken = new ethers.Contract(tokenAddress, LSP7Mintable.abi, provider);

try {
  console.log("----------------it's in");
  // Generate the calldata to token transfer
  const tokenCalldata = myToken.interface.encodeFunctionData('transfer', [
    '0x001a8B69b2bA0D990118C454f172cbA8EFEcA054', // Sender
    '0x77D7b3c78200cE381a95AA2AF41b84947aFE5862', // Receiving address
    15, // Token amount
    false, // Force parameter
    '0x', // Additional data
  ]);
  console.log('----------------calldata is correct');

  // Call the execute function of the profile to then call the token contract
  // Will forward to the LSP6 Key Manager to check permissions of the controller
  const transaction = await myUniversalProfile.execute(
    0, // Operation of type CALL
    tokenAddress, // Target contract to call, on the behalf of this profile
    0, // Amount in LYX
    tokenCalldata, // Contract calldata, empty for regular transfer
    { gasLimit: 500000, from: controller }, // Gas limit of the transaction and sender address
  );
  const txReceipt = await transaction.wait();
  console.log('----------------transaction is correcto');
  console.log('Transaction hash:', txReceipt.transactionHash);
  console.log('Transaction successful.');
} catch (error) {
  console.error('Error:', error);
}
