// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");

// Sample addresses
const SAMPLE_PROFILE_ADDRESS = "0xa907c1904c22DFd37FF56c1f3c3d795682539196";

// Network and storage
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";

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
    const result = await profile.fetchData("LSP1UniversalReceiverDelegate");
    return result.value;
  } catch (error) {
    return console.log("This is not an ERC725 Contract: ", error);
  }
}

// Debug
fetchUniversalReceiverAddress(SAMPLE_PROFILE_ADDRESS).then((receiverAddress) =>
  console.log(receiverAddress)
);
