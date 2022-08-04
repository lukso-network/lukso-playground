// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
require("isomorphic-fetch");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");
const LSP4Schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");

// Static variables
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";
const SAMPLE_PROFILE_ADDRESS = "0xa907c1904c22DFd37FF56c1f3c3d795682539196";
const SAMPLE_ASSET_ADDRESS = "0x923F49Bac508E4Ec063ac097E00b4a3cAc68a353";

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
async function fetchReceivedAssets(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    const result = await profile.fetchData("LSP5ReceivedAssets[]");
    return result.value;
  } catch (error) {
    return console.log("This is not an ERC725 Contract");
  }
}

/*
 * Get the dataset of an asset
 *
 * @param address of the asset
 * @return string of the encoded data
 */
async function getAssetData(address) {
  try {
    const digitalAsset = new ERC725(LSP4Schema, address, provider, config);
    return await digitalAsset.fetchData("LSP4Metadata");
  } catch (error) {
    console.log("Could not fetch asset data: ", error);
  }
}

// Step 1
fetchReceivedAssets(SAMPLE_PROFILE_ADDRESS).then((profileData) =>
  console.log(JSON.stringify(profileData, undefined, 2))
);

// Step 2
getAssetData(SAMPLE_ASSET_ADDRESS).then((assetData) =>
  console.log(JSON.stringify(assetData, undefined, 2))
);
