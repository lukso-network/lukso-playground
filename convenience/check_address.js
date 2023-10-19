// Imports
import Web3 from 'web3';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const SAMPLE_PROFILE_ADDRESS = '0x9139def55c73c12bcda9c44f12326686e3948634';

// Setup Web3
const web3 = new Web3(RPC_ENDPOINT);

/*
 * Check if input is a valid blockchain address
 *
 * @param address input
 * @return boolean result
 */
function isValidAddress(address) {
  const formattedAddress = web3.utils.toChecksumAddress(address);
  return web3.utils.checkAddressChecksum(formattedAddress);
}

// Debug
console.log(isValidAddress(SAMPLE_PROFILE_ADDRESS));
