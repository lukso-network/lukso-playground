// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
require("isomorphic-fetch");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");

// Sample Addresses
const SAMPLE_PROFILE_ADDRESS = "0x0Ac71c67Fa5E4c9d4af4f99d7Ad6132936C2d6A3";

// Network & Storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";

// Parameters for ERC725 Instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

/*
 * Fetch the @param's Universal Profile's
 * LSP5 data for received assets
 *
 * @param address of Universal Profile
 * @return string JSON or custom error
 */
async function fetchReceivedAssets(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    return await (
      await profile.fetchData("LSP5ReceivedAssets[]")
    ).value;
  } catch (error) {
    return console.log("This is not an ERC725 Contract");
  }
}

// Step 1
fetchReceivedAssets(SAMPLE_PROFILE_ADDRESS).then((profileData) =>
  console.log(JSON.stringify(profileData, undefined, 2))
);
