// Static variables
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";
const SAMPLE_PROFILE_ADDRESS = "0x0C03fBa782b07bCf810DEb3b7f0595024A444F4e";

// Import and Network Setup
const Web3 = require("web3");
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
