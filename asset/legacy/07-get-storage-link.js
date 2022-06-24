// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
const LSP4schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");

// Sample addresses
const SAMPLE_ASSET_ADDRESS = "0xc444009d38d3046bb0cF81Fa2Cd295ce46A67C78";

// Network and storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://cloudflare-ipfs.com/ipfs/";

// Legacy ABIs and schemas
const ERC725MinimalABI = require("./erc725_legacy_minimal_abi.json");

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

/*
 * Get the dataset of an asset
 *
 * @param data key of the property to fetch
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

/*
 * Decode the value from ERC725Y storage
 * based on its data key and phrase
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

// Debug
getAssetData(MetaDataKey, SAMPLE_ASSET_ADDRESS).then((encodedData) => {
  decodeAssetData(MetaDataKey, encodedData).then((decodedData) => {
    getMetaDataLink(decodedData).then((dataURL) => console.log(dataURL));
  });
});
