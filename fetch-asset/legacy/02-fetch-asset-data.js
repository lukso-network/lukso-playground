// Imports
const { ERC725 } = require("@erc725/erc725.js");
const LSP4Schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");
const Web3 = require("web3");
require("isomorphic-fetch");

// Static variables
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";
const SAMPLE_ASSET_ADDRESS = "0xc444009d38d3046bb0cF81Fa2Cd295ce46A67C78";

// Parameters for the ERC725 instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

// Setup Web3
const web3 = new Web3(RPC_ENDPOINT);

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
    return console.log("Data of assets address could not be fetched: ", error);
  }
}

// Debug
fetchAssetData(SAMPLE_ASSET_ADDRESS).then((assetData) =>
  console.log(JSON.stringify(assetData, undefined, 2))
);
