// Imports
const Web3 = require("web3");
const LSP4 = require("@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json");
const {
  ERC725Y_INTERFACE_IDS,
} = require("@erc725/erc725.js/build/main/src/lib/constants");

// Sample Addresses
const SAMPLE_ASSET_ADDRESS = "0xfE85568Fea15A7ED3c56F7ca6544F2b96Aeb1774";

// Setup Web3
const web3 = new Web3("https://rpc.l14.lukso.network");

/*
 * Check the ERC725Y interface of an asset's smart contract
 *
 * @param assetAddress address of digital asset smart contract
 * @return boolean - true if the address supports ERC725Y, false if it doesn't
 */
async function checkErc725YInterfaceId(assetAddress) {
  // Create instance of the digital asset contract
  const Contract = new web3.eth.Contract(LSP4.abi, assetAddress);

  let interfaceCheck = false;

  // Check if the contract has a key-value store
  try {
    interfaceCheck = await Contract.methods
      .supportsInterface(ERC725Y_INTERFACE_IDS["3.0"])
      .call();
  } catch (error) {
    console.log(error.message);
    console.log("Address could not be checked for ERC725 interface");
  }

  return interfaceCheck;
}

// Debug
checkErc725YInterfaceId(SAMPLE_ASSET_ADDRESS).then((isERC725Y) =>
  console.log(isERC725Y)
);
