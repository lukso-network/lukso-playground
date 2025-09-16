import { ERC725 } from '@erc725/erc725.js';
import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp4Schema,
  '0x0514A829C832639Afcc02D257154A9DaAD8fa21B', // LSP7 Address
  'https://rpc.testnet.lukso.network',
  {
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
  },
);

// Get all data keys from the asset smart contract
const assetData = await erc725js.getData();
console.log(assetData);
