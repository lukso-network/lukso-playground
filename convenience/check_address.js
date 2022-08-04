// Import and Setup
const Web3 = require("web3");
const web3 = new Web3();

// Static address
const SAMPLE_PROFILE_ADDRESS = "0x0C03fBa782b07bCf810DEb3b7f0595024A444F4e";

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
