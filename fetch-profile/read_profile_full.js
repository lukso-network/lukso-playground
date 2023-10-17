// Import and Network Setup
import Web3 from 'web3';
import { ERC725 } from '@erc725/erc725.js';
import 'isomorphic-fetch';

// Our static variables
const SAMPLE_PROFILE_ADDRESS = '0x6979474Ecb890a8EFE37daB2b9b66b32127237f7';
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';
const IPFS_GATEWAY = 'https://ipfs-proxy.lukso-account.workers.dev/ipfs/';

// Parameters for ERC725 Instance
import erc725schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

/*
 * Try fetching the @param's Universal Profile
 *
 * @param address of Universal Profile
 * @return string JSON or custom error
 */
async function fetchProfile(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    return await profile.fetchData();
  } catch (error) {
    return console.log('This is not an ERC725 Contract: ', error);
  }
}

/*
 * Fetch the @param's Universal Profile's
 * LSP3 data
 *
 * @param address of Universal Profile
 * @return string JSON or custom error
 */
async function fetchProfileData(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    return await profile.fetchData('LSP3Profile');
  } catch (error) {
    return console.log('This is not an ERC725 Contract: ', error);
  }
}

// Step 1
fetchProfile(SAMPLE_PROFILE_ADDRESS).then((profileData) =>
  console.log(JSON.stringify(profileData, undefined, 2)),
);

// Step 2
fetchProfileData(SAMPLE_PROFILE_ADDRESS).then((profileData) =>
  console.log(JSON.stringify(profileData, undefined, 2)),
);
