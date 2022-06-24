// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");

// Sample addresses
const SAMPLE_PROFILE_ADDRESS = "0x0C03fBa782b07bCf810DEb3b7f0595024A444F4e";

// Network and storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://cloudflare-ipfs.com/ipfs/";

// Legacy ABIs and schemas
const ERC725LegacySchema = require("./erc725_legacy_minimal_schema.json");

// Parameters for the ERC725 instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

/*
 * Fetch the ever issued assets from
 * the Universal Profile
 *
 * @param address of the Universal Profile
 * @return address[] of the issued assets or custom error
 */
async function fetchIssuedAssets(address) {
  try {
    const profile = new ERC725(ERC725LegacySchema, address, provider, config);
    const result = await profile.getData("LSP3IssuedAssets[]");
    return result.value;
  } catch (error) {
    return console.log("Issued assets could not be fetched");
  }
}

// Debug
fetchIssuedAssets(SAMPLE_PROFILE_ADDRESS).then((issuedAssets) =>
  console.log(issuedAssets)
);
