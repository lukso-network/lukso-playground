// Imports
import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';
import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts/dist/constants.cjs.js';

// Asset Example
const myAsset = new ERC725(
  lsp4Schema,
  '0x6395b330F063F96579aA8F7b59f2584fb9b6c3a5',
  'https://rpc.testnet.lukso.gateway.fm',
  {
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
  },
);

const isLSP7 = await myAsset.supportsInterface(INTERFACE_IDS.LSP7DigitalAsset);

const isLSP8 = await myAsset.supportsInterface(
  INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
);

console.log(isLSP7, isLSP8); // true or false

// Profile Example
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.testnet.lukso.network',
);

// Create an instance of the Universal Profile
const myProfile = new ethers.Contract(
  '0x9139def55c73c12bcda9c44f12326686e3948634',
  UniversalProfile.abi,
  provider,
);

const isLSP0 = await myProfile.supportsInterface(
  INTERFACE_IDS.LSP0ERC725Account,
);
console.log(isLSP0); // true or false

/*
Supported interfaces from lsp-smart-contracts library:

INTERFACE_IDS.ERC165                        INTERFACE_IDS.ERC20
INTERFACE_IDS.ERC223                        INTERFACE_IDS.ERC721
INTERFACE_IDS.ERC721Metadata                INTERFACE_IDS.ERC725X
INTERFACE_IDS.ERC725Y                       INTERFACE_IDS.ERC777
INTERFACE_IDS.ERC1155         

INTERFACE_IDS.LSP0ERC725Account             INTERFACE_IDS.LSP1UniversalReceiver
INTERFACE_IDS.LSP6KeyManager                INTERFACE_IDS.LSP7DigitalAsset
INTERFACE_IDS.LSP8IdentifiableDigitalAsset  INTERFACE_IDS.LSP9Vault
INTERFACE_IDS.LSP11BasicSocialRecovery      INTERFACE_IDS.LSP14Ownable2Step
INTERFACE_IDS.LSP17Extendable               INTERFACE_IDS.LSP17Extension
INTERFACE_IDS.LSP20CallVerification         INTERFACE_IDS.LSP20CallVerifier
INTERFACE_IDS.LSP25ExecuteRelayCall 
*/
