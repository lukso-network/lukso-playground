import { ERC725 } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json' assert { type: 'json' };

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp3ProfileSchema,
  '0x6395b330F063F96579aA8F7b59f2584fb9b6c3a5',
  'https://rpc.testnet.lukso.gateway.fm',
  {},
);

// Fetch the supported storage standard
let isLSP4 = false;

// Verify if the standard is supported (value !== null)
const data = await erc725js.getData('SupportedStandards:LSP4DigitalAsset');
if (data.value !== null) {
  isLSP4 = true;
}

console.log(isLSP4);

/*
Supported schemas from erc725.js library:

LSP1UniversalReceiverDelegate       LSP3ProfileMetadata
LSP4DigitalAsset                    LSP5ReceivedAssets
LSP6KeyManager                      LSP8IdentifiableDigitalAsset
LSP9Vault                           LSP10ReceivedVaults
LSP12IssuedAssets                   LSP17ContractExtension

All fetchable keys can be found within @erc725/erc725.js/schemas/[schema].json
*/
