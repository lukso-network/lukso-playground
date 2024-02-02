import { ERC725 } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp3ProfileSchema,
  '0x9139def55c73c12bcda9c44f12326686e3948634', // UP Contract Address
  'https://rpc.testnet.lukso.gateway.fm',
  {
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
  },
);

// Get all data keys from the profile smart contract
let profileData = await erc725js.getData();
console.log(profileData);
