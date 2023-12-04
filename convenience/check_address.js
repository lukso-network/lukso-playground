// Imports
import { ethers } from 'ethers';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const SAMPLE_PROFILE_ADDRESS = '0x9139def55c73c12bcda9c44f12326686e3948634';

// Setup ethers.js
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

/*
 * Check if input is a valid blockchain address
 *
 * @param address input
 * @return boolean result
 */
async function isValidAddress(address) {
  try {
    // Create an Ethereum Address object
    const ethereumAddress = ethers.utils.getAddress(address);

    // Check if the address is a valid Ethereum address
    return ethereumAddress === address;
  } catch (error) {
    return false;
  }
}

// Debug
isValidAddress(SAMPLE_PROFILE_ADDRESS)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
