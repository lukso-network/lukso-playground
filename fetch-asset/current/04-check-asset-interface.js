// Imports
const Web3 = require("web3");
const LSP4 = require("@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json");
const {
  ERC725Y_INTERFACE_IDS,
} = require("@erc725/erc725.js/build/main/src/lib/constants");

// Sample addresses
const SAMPLE_ASSET_ADDRESS = "0x923F49Bac508E4Ec063ac097E00b4a3cAc68a353";

// Setup Web3
const web3 = new Web3("https://rpc.l16.lukso.network");

/*
 * Check the ERC725Y interface of an asset
 *
 * @param assetAddress of the smart contract
 * @return boolean isERC725Y
 */
async function checkErc725YInterfaceId(assetAddress) {
  // Create an instance of the asset
  const asset = new web3.eth.Contract(LSP4.abi, assetAddress);

  let isERC725Y = false;

  // Check if the contract has a key-value store
  try {
    isERC725Y = await asset.methods
      .supportsInterface(ERC725Y_INTERFACE_IDS["3.0"])
      .call();
  } catch (error) {
    console.log(error.message);
    console.log("Address could not be checked for ERC725 interface");
  }

  return isERC725Y;
}

// Debug
checkErc725YInterfaceId(SAMPLE_ASSET_ADDRESS).then((isERC725Y) =>
  console.log(isERC725Y)
);
