import { ERC725 } from '@erc725/erc725.js';
import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json' assert { type: 'json' };

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp4Schema,
  '0x0514A829C832639Afcc02D257154A9DaAD8fa21B', // LSP7 Address
  'https://rpc.testnet.lukso.gateway.fm',
  {
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
  },
);

// Download and verify the asset metadata JSON file
let assetMetadata = await erc725js.fetchData('LSP4Metadata');

// Print simplified JSON
console.log(assetMetadata);

// Print full JSON
console.log(JSON.stringify(assetMetadata, null, 2));

// Fetch all creators of the asset
let assetCreatorsList = await erc725js.fetchData('LSP4Creators[]');
console.log(assetCreatorsList);

// Fetch the asset's token type
let tokenType = await erc725js.fetchData('LSP4TokenType');
console.log(tokenType);

// Fetch the asset's token symbol
let tokenSymbol = await erc725js.fetchData('LSP4TokenSymbol');
console.log(tokenSymbol);

// Fetch the asset's token name
let tokenName = await erc725js.fetchData('LSP4TokenName');
console.log(tokenName);

/*
 * Fetch creator-specific information
 *
 * Uncomment and exchange <address> with an address
 * of a creator you want to retrieve.
 */

// let creatorInformation = await erc725js.fetchData(
//   'LSP4CreatorsMap:<address>',
// );
// console.log(creatorInformation);
