// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
require("isomorphic-fetch");
const LSP4schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");
const LSP4 = require("@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json");

// Sample addresses
const SAMPLE_ASSET_ADDRESS = "0x081d3f0bff8ae2339cb65113822eec1510704d5c";

// Network and storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";

// Parameters for the ERC725 instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

// Setup Web3
const web3 = new Web3("https://rpc.l14.lukso.network");

// Data keys for asset properties
const TokenNameKey = LSP4schema[1].key;
const TokenSymbolKey = LSP4schema[2].key;
const MetaDataKey = LSP4schema[3].key;
const CreatorsKey = LSP4schema[4].key;

// Fetchable Asset information
let assetImageLinks = [];
let fullSizeAssetImage;
let assetDescription;

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

/*
 * Decode the value from ERC725Y storage
 * based on its key and phrase
 *
 * @param data key of the asset property to fetch
 * @param encodedData as string
 * @return JSON of the decoded data
 */
async function decodeAssetData(keyName, encodedData) {
  try {
    // Instanciate the asset
    const digitalAsset = new ERC725(
      LSP4schema,
      SAMPLE_ASSET_ADDRESS,
      provider,
      config
    );

    // Decode the assets data
    return digitalAsset.decodeData({
      keyName: keyName,
      value: encodedData,
    });
  } catch (error) {
    console.log("Data of an asset could not be decoded");
  }
}

/*
 * Create a fetchable storage link that
 * was embeded into the decoded asset data
 *
 * @param decodedAssetMetadata as JSON
 * @return string of asset data URL
 */
async function getMetaDataLink(decodedAssetMetadata) {
  try {
    // Generate IPFS link from decoded metadata
    return IPFS_GATEWAY + decodedAssetMetadata.value.url.substring(7);
  } catch (error) {
    console.log("URL could not be fetched");
  }
}

/*
 * Fetch the asset data from the provided
 * storage link
 *
 * @param dataURL as string
 * @return string with asset data as JSON
 */
async function fetchAssetData(dataURL) {
  try {
    const response = await fetch(dataURL);
    return await response.json();
  } catch (error) {
    console.log("JSON data of IPFS link could not be fetched");
  }
}

/*
 * Read properties of an asset
 */
async function getAssetProperties(assetJSON) {
  let assetImageData = [];
  try {
    assetImageData = assetJSON.LSP4Metadata.images;
    for (let i in assetImageData) {
      assetImageLinks.push([
        i,
        IPFS_GATEWAY + assetImageData[0][i].url.substring(7),
      ]);
    }

    fullSizeAssetImage = assetImageLinks[0][1];
    assetDescription = assetJSON.LSP4Metadata.description;
    console.log("Asset Description " + assetDescription);
    console.log("Full Size Asset Image Link: " + fullSizeAssetImage + "\n");
    console.log(
      "Asset Image Links: " +
        JSON.stringify(assetImageLinks, undefined, 2) +
        "\n"
    );
  } catch (error) {
    console.log(error);
    console.log("Could not fetch all asset properties");
  }
}
// Debug
getAssetData(MetaDataKey, SAMPLE_ASSET_ADDRESS).then((encodedData) => {
  decodeAssetData(MetaDataKey, encodedData).then((decodedData) => {
    getMetaDataLink(decodedData).then((dataURL) => {
      fetchAssetData(dataURL).then((assetJSON) => {
        getAssetProperties(assetJSON);
      });
    });
  });
});
