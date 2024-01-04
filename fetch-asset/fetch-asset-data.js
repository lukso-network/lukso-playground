// Imports
import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';
import LSP4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json' assert { type: 'json' };
import 'isomorphic-fetch';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';
const SAMPLE_ASSET_ADDRESS = '0x6395b330F063F96579aA8F7b59f2584fb9b6c3a5';

// Parameters for the ERC725 instance
const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

/*
 * Get the dataset of an asset
 *
 * @param address of the asset
 * @return string of the encoded data
 */
async function fetchAssetData(address) {
  try {
    const digitalAsset = new ERC725(LSP4Schema, address, provider, config);
    return await digitalAsset.fetchData('LSP4Metadata');
  } catch (error) {
    console.log('Could not fetch asset data: ', error);
  }
}

// Debug
fetchAssetData(SAMPLE_ASSET_ADDRESS).then((assetData) =>
  console.log(JSON.stringify(assetData, undefined, 2)),
);
