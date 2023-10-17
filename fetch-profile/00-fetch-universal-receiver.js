// Imports
import Web3 from 'web3';
import { ERC725 } from '@erc725/erc725.js';
import erc725schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';
const IPFS_GATEWAY = 'https://ipfs-proxy.lukso-account.workers.dev/ipfs/';
const SAMPLE_PROFILE_ADDRESS = '0x6979474Ecb890a8EFE37daB2b9b66b32127237f7';

// Parameters for the ERC725 instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

/*
 * Fetch the LSP5 data of the Universal Profile
 * to get its ever received assets
 *
 * @param address of the Universal Profile
 * @return address[] of received assets or custom error
 */
async function fetchUniversalReceiverAddress(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    const result = await profile.fetchData('LSP1UniversalReceiverDelegate');
    return result.value;
  } catch (error) {
    return console.log('This is not an ERC725 Contract: ', error);
  }
}

// Debug
fetchUniversalReceiverAddress(SAMPLE_PROFILE_ADDRESS).then((receiverAddress) =>
  console.log(receiverAddress),
);
