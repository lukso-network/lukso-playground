// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
require("isomorphic-fetch");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");
const LSP8 = require("@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json");
const LSP4schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");

// Sample addresses
const SAMPLE_ASSET_ADDRESS = "0xc444009d38d3046bb0cF81Fa2Cd295ce46A67C78";
const SAMPLE_PROFILE_ADDRESS = "0x0C03fBa782b07bCf810DEb3b7f0595024A444F4e";

// Network and storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://cloudflare-ipfs.com/ipfs/";

// Legacy ABIs and schemas
const LSP1MinimalABI = require("./lsp1_legacy_minimal_abi.json");
const LSP4MinimalABI = require("./lsp4_legacy_minimal_abi.json");
const ERC725MinimalABI = require("./erc725_legacy_minimal_abi.json");
const ERC725LegacySchema = require("./erc725_legacy_minimal_schema.json");

// Parameters for the ERC725 instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

// Setup Web3
const web3 = new Web3("https://rpc.l14.lukso.network");

// Keys for asset properties
const TokenNameKey = LSP4schema[1].key;
const TokenSymbolKey = LSP4schema[2].key;
const MetaDataKey = LSP4schema[3].key;
const CreatorsKey = LSP4schema[4].key;

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

/*
 * Return an array of assets
 * that are owned by the
 * Universal Profile.
 *
 * @param owner of the Universal Profile
 * @return address[] of owned assets
 */
async function fetchOwnedAssets(owner) {
  const receiverAddress = await fetchUniversalReceiver(owner);
  const digitalAssets = await fetchReceivedAssets(receiverAddress);
  const ownedAssets = [];

  for (let i = 0; i < digitalAssets.length; i++) {
    // Create instance of the asset to check owner balance
    const LSP8Contract = new web3.eth.Contract(LSP8.abi, digitalAssets[i]);

    const isCurrentOwner = await LSP8Contract.methods.balanceOf(owner).call();
    if (isCurrentOwner > 0) {
      ownedAssets[ownedAssets.length] = digitalAssets[i];
    }
  }
  return ownedAssets;
}

// Debug
fetchOwnedAssets(SAMPLE_PROFILE_ADDRESS).then((ownedAssets) =>
  console.log(ownedAssets)
);
