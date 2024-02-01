import { ERC725 } from '@erc725/erc725.js';
import lsp9VaultSchema from '@erc725/erc725.js/schemas/LSP9Vault.json';

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp9VaultSchema,
  '0x9139def55c73c12bcda9c44f12326686e3948634',
  'https://rpc.testnet.lukso.gateway.fm',
  {},
);

// Fetch the supported storage standard
let isLSP9 = false;

// Verify if the standard is supported (value !== null)
const data = await erc725js.getData('SupportedStandards:LSP9Vault');
if (data.value !== null) {
  isLSP9 = true;
}

console.log(isLSP9);

/*
Supported schemas from erc725.js library:

LSP1UniversalReceiverDelegate       LSP3ProfileMetadata
LSP4DigitalAsset                    LSP5ReceivedAssets
LSP6KeyManager                      LSP8IdentifiableDigitalAsset
LSP9Vault                           LSP10ReceivedVaults
LSP12IssuedAssets                   LSP17ContractExtension

All fetchable keys can be found within @erc725/erc725.js/schemas/[schema].json
*/
