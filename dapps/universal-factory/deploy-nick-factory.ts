import { ethers } from 'ethers';

const RPC_URL = 'https://rpc.testnet.lukso.network';
const provider = new ethers.JsonRpcProvider(RPC_URL);

// The private key should not be comitted to a public GitHub repository.
const signer = new ethers.Wallet('<private-key>', provider);

const fundingTx = await signer.sendTransaction({
  // Standardized address
  to: '0x3fab184622dc19b6109349b94811493bf2a45362',
  value: ethers.parseEther('0.009'), // This value should be enough
  // Check gasLimit and gasPrice to estimate exactly the value: https://github.com/Arachnid/deterministic-deployment-proxy
});

await fundingTx.wait();

// Sending raw transaction specified by the Nick factory
const rawTx =
  '0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222';

const deployNickFactoryTx = await provider.broadcastTransaction(rawTx);
await deployNickFactoryTx.wait();
