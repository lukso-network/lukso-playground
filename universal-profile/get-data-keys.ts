import { ERC725 } from '@erc725/erc725.js';
// 💡 You can load the default schemas directly from @erc725.js
// https://docs.lukso.tech/tools/erc725js/schemas
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';

const myUniversalProfileAddress = '0x9139def55c73c12bcda9c44f12326686e3948634';
// Note: You can debug any smart contract by using the ERC725 Tools
// https://erc725-inspect.lukso.tech/inspector?address=0x9139def55c73c12bcda9c44f12326686e3948634&network=testnet

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp3ProfileSchema,
  myUniversalProfileAddress,
  'https://4201.rpc.thirdweb.com',
  {
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
  },
);

// Get all data keys from the profile smart contract
const profileData = await erc725js.getData();
console.log(profileData);
