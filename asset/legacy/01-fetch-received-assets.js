// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
require("isomorphic-fetch");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");

// Sample addresses
const SAMPLE_PROFILE_ADDRESS = "0x0C03fBa782b07bCf810DEb3b7f0595024A444F4e";

// Network and storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://cloudflare-ipfs.com/ipfs/";

// Legacy ABIs and schemas
const LSP1MinimalABI = require("./lsp1_legacy_minimal_abi.json");

// Parameters for the ERC725 instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

// Setup Web3
const web3 = new Web3("https://rpc.l14.lukso.network");

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

/*
 * Get all received assets from the
 * Universal Receiver of the
 * Universal Profile.
 *
 * @param address of the Universal Receiver
 * @return address[] of the received assets
 */
async function fetchReceivedAssets(receiverAddress) {
  const universalReceiver = new web3.eth.Contract(
    LSP1MinimalABI,
    receiverAddress
  );

  let rawValues = [];

  try {
    // Fetch all raw values
    rawValues = await universalReceiver.methods.getAllRawValues().call();
  } catch (error) {
    return console.log("Data from universal receiver could not be loaded");
  }

  const receivedAssets = [];

  // Retrieve addresses
  for (let i = 0; i < rawValues.length; i++) {
    receivedAssets[i] = web3.utils.toChecksumAddress(rawValues[i].substr(26));
  }
  return receivedAssets;
}

// Debug
fetchUniversalReceiver(SAMPLE_PROFILE_ADDRESS).then((receiverAddress) => {
  fetchReceivedAssets(receiverAddress).then((receivedAssets) =>
    console.log(receivedAssets)
  );
});
