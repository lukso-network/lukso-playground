// Imports
const { ERC725 } = require("@erc725/erc725.js");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");
const LSP4Schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");
const Web3 = require("web3");
require("isomorphic-fetch");

// Static variables
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";
const SAMPLE_PROFILE_ADDRESS = "0x0C03fBa782b07bCf810DEb3b7f0595024A444F4e";
const SAMPLE_ASSET_ADDRESS = "0xc444009d38d3046bb0cF81Fa2Cd295ce46A67C78";

// Legacy ABIs and schemas
const LSP1MinimalABI = require("./lsp1_legacy_minimal_abi.json");

// Parameters for the ERC725 instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

// Setup Web3
const web3 = new Web3(RPC_ENDPOINT);

/*
 * Fetch the profile's Universal Receiver
 *
 * @param address of the Universal Profile
 * @return address of Universal Receiver
 */
async function fetchUniversalReceiverAddress(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    const result = await profile.fetchData("LSP1UniversalReceiverDelegate");
    return result.value;
  } catch (error) {
    return console.log("Universal Receiver could not be fetched");
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

/*
 * Get the dataset of an asset
 *
 * @param data key of the property to fetch
 * @return string of the encoded data
 */
async function fetchAssetData(address) {
  try {
    // Instanciate asset
    const digitalAsset = new ERC725(LSP4Schema, address, provider, config);

    // Fetch the encoded data
    return await digitalAsset.fetchData("LSP4Metadata");
  } catch (error) {
    return console.log("Data of assets address could not be fetched:", error);
  }
}

// Step 1
fetchUniversalReceiverAddress(SAMPLE_PROFILE_ADDRESS).then(
  (receiverAddress) => {
    fetchReceivedAssets(receiverAddress).then((ownedAssets) =>
      console.log(JSON.stringify(ownedAssets, undefined, 2))
    );
  }
);

// Step 2
fetchAssetData(SAMPLE_ASSET_ADDRESS).then((assetData) =>
  console.log(JSON.stringify(assetData, undefined, 2))
);
