import { ethers } from 'ethers';

import { ERC725 } from '@erc725/erc725.js';
import LSP12Schema from '@erc725/erc725.js/schemas/LSP12IssuedAssets.json';

import UniversalProfileArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts';

// We will register the issued assets by setting the following LSP12 data keys
// - LSP12IssuedAssets[]
// - LSP12IssuedAssetsMap:<asset-address>

// Add the type of asset (LSP7 or LSP8) and their address in the object list below
const issuedAssets = [
  {
    interfaceId: INTERFACE_IDS.LSP7DigitalAsset,
    address: '0xf7056bdE90f494F55967858F1e9E4AFB1026C5C8',
  },
  {
    interfaceId: INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
    address: '0xf651b88925C0B6C81Ad6f658a2F104226d837F60',
  },
  //   {
  //     interfaceId: LSP7 or LSP8 interface ID (or other),
  //     address: '0xasset-address',
  //   },
];

// Get the private key of a Universal Profile controller
const UNIVERSAL_PROFILE_ADDRESS = process.env.UP_ADDR || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';

const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);
const myWallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Encode the data keys related to LSP12IssuedAssets[]
const erc725 = new ERC725(
  LSP12Schema,
  UNIVERSAL_PROFILE_ADDRESS,
  RPC_ENDPOINT,
  {
    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
  },
);

const allAssetAddresses = issuedAssets.map((asset) => asset.address);

const issuedAssetsMap = issuedAssets.map((asset, index) => {
  return {
    keyName: 'LSP12IssuedAssetsMap:<address>',
    dynamicKeyParts: asset.address,
    value: [asset.interfaceId, ERC725.encodeValueType('uint128', index)],
  };
});

const { keys: lsp12DataKeys, values: lsp12Values } = erc725.encodeData([
  { keyName: 'LSP12IssuedAssets[]', value: allAssetAddresses },
  ...issuedAssetsMap,
]);

// Create an instance of your Universal Profile contract
const myUPContract = new ethers.Contract(
  UNIVERSAL_PROFILE_ADDRESS,
  UniversalProfileArtifact.abi,
  myWallet,
);

// Set these data keys on the Universal Profile using `setDataBatch`
await myUPContract.setDataBatch(lsp12DataKeys, lsp12Values);
