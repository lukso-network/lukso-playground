// Imports
const Web3 = require("web3");

// Sample addresses
const SAMPLE_ASSET_ADDRESS = "0xc444009d38d3046bb0cF81Fa2Cd295ce46A67C78";

// Legacy ABIs and schemas
const LSP4MinimalABI = require("./lsp4_legacy_minimal_abi.json");

// Setup Web3
const web3 = new Web3("https://rpc.l14.lukso.network");

/*
 * Check the ERC725Y interface of an asset
 *
 * @param assetAddress of the smart contract
 * @return boolean isERC725YLegacy
 */

async function checkErc725YInterfaceId(address) {
  // Create an instance of the asset
  const asset = new web3.eth.Contract(LSP4MinimalABI, address);

  const erc725YLegacyInterfaceId = "0x2bd57b73";
  let isERC725YLegacy = false;

  // Check if the contract is a legacy key-value store interface
  try {
    isERC725YLegacy = await asset.methods
      .supportsInterface(erc725YLegacyInterfaceId)
      .call();
    return isERC725YLegacy;
  } catch (error) {
    console.log("Address could not be checked for ERC725YLegacy interface");
  }
  return isERC725YLegacy;
}

// Debug
checkErc725YInterfaceId(SAMPLE_ASSET_ADDRESS).then((isLegacy) =>
  console.log(isLegacy)
);
