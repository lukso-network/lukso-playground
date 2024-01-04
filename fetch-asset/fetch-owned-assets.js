// Imports
import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';
import erc725schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json' assert { type: 'json' };
import 'isomorphic-fetch';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';
const SAMPLE_PROFILE_ADDRESS = '0x9139def55c73c12bcda9c44f12326686e3948634';

// Parameters for the ERC725 instance
const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

/*
 * Fetch the LSP5 data of the Universal Profile
 * to get its ever received assets
 *
 * @param address of the Universal Profile
 * @return address[] of received assets or custom error
 */
async function fetchOwnedAssets(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    const result = await profile.fetchData('LSP5ReceivedAssets[]');
    return result.value;
  } catch (error) {
    return console.log('This is not an ERC725 Contract: ', error);
  }
}

// Debug
fetchOwnedAssets(SAMPLE_PROFILE_ADDRESS).then((ownedAssets) =>
  console.log(JSON.stringify(ownedAssets, undefined, 2)),
);
