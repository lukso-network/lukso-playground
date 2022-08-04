// Imports
const { ERC725 } = require("@erc725/erc725.js");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");
const Web3 = require("web3");
require("isomorphic-fetch");

// Static variables
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";
const SAMPLE_PROFILE_ADDRESS = "0xa907c1904c22DFd37FF56c1f3c3d795682539196";

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
async function fetchOwnedAssets(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    const result = await profile.fetchData("LSP5ReceivedAssets[]");
    return result.value;
  } catch (error) {
    return console.log("This is not an ERC725 Contract");
  }
}

// Debug
fetchOwnedAssets(SAMPLE_PROFILE_ADDRESS).then((ownedAssets) =>
  console.log(JSON.stringify(ownedAssets, undefined, 2))
);
