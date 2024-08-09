import { ethers } from 'ethers';
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';

// should be in the smart contracts folder

// Connect to LUKSO via Browser Extension
// @ts-expect-error This is for the browser
const provider = new ethers.BrowserProvider(window.lukso);

try {
  // Request user's permission to connect and access their accounts
  await provider.send('eth_requestAccounts', []);

  // Get the signer (current account)
  const signer = await provider.getSigner();

  // Instantiate the token contract
  const myToken = new ethers.Contract('0x...', LSP7Mintable.abi, signer);

  // Send the token transaction
  const tx = await myToken.transfer(
    '0x...', // receiving address
    15, // token amount
    false, // force parameter
    '0x', // additional data
  );

  // Wait for the transaction to be included in a block
  await tx.wait();

  console.log('Token transaction sent successfully.');
} catch (error) {
  console.error('Error:', error);
}
