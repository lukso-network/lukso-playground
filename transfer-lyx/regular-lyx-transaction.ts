import { ethers } from 'ethers';

// Check if the Ethereum provider is available
// @ts-expect-error This is for the browser
const provider = new ethers.BrowserProvider(window.ethereum);

try {
  // Request user accounts (connect to wallet)
  const accounts = await provider.send('eth_requestAccounts', []);

  // Send a transaction
  const transactionResponse = await provider.send('eth_sendTransaction', [
    {
      from: accounts[0], // The Universal Profile address
      to: '0x...', // Receiving address, can be a UP or EOA
      value: ethers.parseEther('0.5'), // 0.5 amount in ETH, converting to wei
    },
  ]);

  // Wait for transaction confirmation
  await transactionResponse.wait();

  console.log('Transaction hash:', transactionResponse.hash);
  console.log('Transaction successful.');
} catch (error) {
  console.error('Error:', error);
}
