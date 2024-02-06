import { ERC725 } from '@erc725/erc725.js';
import lsp9VaultSchema from '@erc725/erc725.js/schemas/LSP9Vault.json';

// 📚 https://docs.lukso.tech/learn/dapp-developer/standard-detection/#metadata-detection

// TODO: this is an old vault and its interface ID is not correct
const vaultContractAddress = '0x9139def55c73c12bcda9c44f12326686e3948634';

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp9VaultSchema,
  vaultContractAddress,
  'https://rpc.testnet.lukso.gateway.fm',
  {},
);

// Verify if the standard is supported (value !== null)
const data = await erc725js.getData('SupportedStandards:LSP9Vault');
const isLSP9 = data.value !== null;

if (isLSP9) {
  console.log(`✅ The contract: ${vaultContractAddress} supports the LSP9Vault standard`);
} else {
  console.log(`❌ The address: ${vaultContractAddress} does not supports the LSP9Vault standard`);
}
