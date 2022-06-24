// Imports
const Web3 = require("web3");
const LSP4schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");
const LSP4 = require("@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json");

// Sample addresses
const SAMPLE_ASSET_ADDRESS = "0xfE85568Fea15A7ED3c56F7ca6544F2b96Aeb1774";

// Setup Web3
const web3 = new Web3("https://rpc.l14.lukso.network");

// Data keys for asset properties
const TokenNameKey = LSP4schema[1].key;
const TokenSymbolKey = LSP4schema[2].key;
const MetaDataKey = LSP4schema[3].key;
const CreatorsKey = LSP4schema[4].key;

/*
 * Get the dataset of an asset
 *
 * @param data key of the property to fetch
 * @return string of the encoded data
 */
async function getAssetData(key, address) {
  try {
    // Instantiate the asset
    const digitalAsset = new web3.eth.Contract(LSP4.abi, address);

    // Get the encoded data
    return await digitalAsset.methods["getData(bytes32)"](key).call();
  } catch (error) {
    return console.error("Data of assets address could not be loaded");
  }
}

// Debug
getAssetData(MetaDataKey, SAMPLE_ASSET_ADDRESS).then((encodedData) =>
  console.log(encodedData)
);
