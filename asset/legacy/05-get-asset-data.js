// Imports
const Web3 = require("web3");
const LSP4schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");

// Sample addresses
const SAMPLE_ASSET_ADDRESS = "0xc444009d38d3046bb0cF81Fa2Cd295ce46A67C78";

// Legacy ABIs and schemas
const ERC725MinimalABI = require("./erc725_legacy_minimal_abi.json");

// Setup Web3
const web3 = new Web3("https://rpc.l14.lukso.network");

// Keys for asset properties
const TokenNameKey = LSP4schema[1].key;
const TokenSymbolKey = LSP4schema[2].key;
const MetaDataKey = LSP4schema[3].key;
const CreatorsKey = LSP4schema[4].key;

/*
 * Get the dataset of an asset
 *
 * @param key of the property to fetch
 * @return string of the encoded data
 */
async function getAssetData(key, address) {
  try {
    // Instanciate asset
    const digitalAsset = new web3.eth.Contract(ERC725MinimalABI, address);

    // Fetch the encoded data
    return await digitalAsset.methods.getData(key).call();
  } catch (error) {
    return console.log("Data of assets address could not be loaded");
  }
}

// Debug
getAssetData(MetaDataKey, SAMPLE_ASSET_ADDRESS).then((encodedData) =>
  console.log(encodedData)
);
