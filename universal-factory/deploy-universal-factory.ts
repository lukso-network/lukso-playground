import { ethers } from 'ethers';

const RPC_URL = 'https://rpc.testnet.lukso.network';
const provider = new ethers.JsonRpcProvider(RPC_URL);

// The private key should not be comitted to a public GitHub repository.
const signer = new ethers.Wallet('<private-key>', provider);

const lsp16Tx = await signer.sendTransaction({
  to: '0x4e59b44847b379578588920ca78fbf26c0b4956c', // Nick Factory Address
  data:
    '0xfaee762dee0012026f5380724e9744bdc5dd26ecd8f584fe9d72a4170d01c049' + // Standardized Salt
    '60806040523480156100105...', // Standardized Bytecode
  // Copy the full bytecode from https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-16-UniversalFactory.md#standardized-bytecode
});

await lsp16Tx.wait();
