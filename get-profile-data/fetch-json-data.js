import { ERC725 } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json' assert { type: 'json' };

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp3ProfileSchema,
  '0x9139def55c73c12bcda9c44f12326686e3948634',
  'https://rpc.testnet.lukso.gateway.fm',
  {
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
  },
);

// Download and verify the profile metadata JSON file
let profileMetaData = await erc725js.fetchData('LSP3Profile');
console.log(profileMetaData);

// Fetch all of the profile's issued assets
let issuedAssets = await erc725js.fetchData('LSP12IssuedAssets[]');
console.log(issuedAssets);

// Fetch all owned assets of the profile
let receivedAssets = await erc725js.fetchData('LSP5ReceivedAssets[]');
console.log(receivedAssets);

// Fetch the profile's universal receiver
let universalReceiver = await erc725js.fetchData(
  'LSP1UniversalReceiverDelegate',
);
console.log(universalReceiver);
