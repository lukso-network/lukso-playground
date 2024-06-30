import { ethers } from 'ethers';

import { ERC725 } from '@erc725/erc725.js';
import LSP12Schema from '@erc725/erc725.js/schemas/LSP12IssuedAssets.json';

import UniversalProfileArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts';

// We will update the issued assets by setting the following LSP12 data keys
// - LSP12IssuedAssets[]
// - LSP12IssuedAssetsMap:<asset-address>

// Add the type of asset (LSP7 or LSP8) and their address in the object list below
const issuedAssets = [
  {
    interfaceId: INTERFACE_IDS.LSP7DigitalAsset,
    address: '0x41b35F490EB6325001fC94E92C58b9d9CC61586D',
  },
  {
    interfaceId: INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
    address: '0x2EeF6216274BF0EDe21A8A55CbB5b896Bb82AC8B',
  },
  //   {
  //     interfaceId: LSP7 or LSP8 interface ID (or other),
  //     address: '0xasset-address',
  //   },
];

// Get the private key of a Universal Profile controller
const UNIVERSAL_PROFILE_ADDRESS = process.env.UP_ADDR || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const RPC_ENDPOINT = 'https://4201.rpc.thirdweb.com';

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

// Get the current addresses and array length
const currentIssuedAssets = await erc725.getData('LSP12IssuedAssets[]');
let currentAssetAddresses = null;
let currentArrayLength: number = 0;

if (Array.isArray(currentIssuedAssets.value)) {
  currentAssetAddresses = currentIssuedAssets.value;
  currentArrayLength = currentAssetAddresses.length;
}

const newAssetAddresses = issuedAssets.map((asset) => asset.address);

const newIssuedAssetsMapElements = issuedAssets.map((asset, index) => {
  return {
    keyName: 'LSP12IssuedAssetsMap:<address>',
    dynamicKeyParts: asset.address,
    value: [
      asset.interfaceId,
      // index of the issued asset as uint128
      // 1 => 0x00000000000000000000000000000001
      // Example for adding 2 new assets at the end of the existing map
      ERC725.encodeValueType('uint128', currentArrayLength + index),
    ],
  };
});

const { keys: lsp12DataKeys, values: lsp12Values } = erc725.encodeData([
  {
    keyName: 'LSP12IssuedAssets[]',
    value: newAssetAddresses,
    // Example for adding 2 new assets at the end of the existing addresses
    startingIndex: currentArrayLength,
    totalArrayLength: currentArrayLength + newAssetAddresses.length,
  },
  ...newIssuedAssetsMapElements,
]);

// Create an instance of your Universal Profile contract
const myUPContract = new ethers.Contract(
  UNIVERSAL_PROFILE_ADDRESS,
  UniversalProfileArtifact.abi,
  myWallet,
);

// Set these data keys on the Universal Profile using `setDataBatch`
await myUPContract.setDataBatch(lsp12DataKeys, lsp12Values);
