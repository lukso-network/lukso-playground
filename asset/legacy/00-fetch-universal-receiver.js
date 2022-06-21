// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");

// Sample addresses
const SAMPLE_PROFILE_ADDRESS = "0x0C03fBa782b07bCf810DEb3b7f0595024A444F4e";

// Network and storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://cloudflare-ipfs.com/ipfs/";

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
async function fetchUniversalReceiver(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    return await (
      await profile.fetchData("LSP1UniversalReceiverDelegate")
    ).value;
  } catch (error) {
    return console.log("This is not an ERC725 Contract");
  }
}

// Debug
fetchUniversalReceiver(SAMPLE_PROFILE_ADDRESS).then((receiverAddress) =>
  console.log(receiverAddress)
);
