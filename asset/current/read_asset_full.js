// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
require("isomorphic-fetch");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");
const LSP4schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");
const LSP8 = require("@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json");
const LSP4 = require("@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json");
const {
  ERC725Y_INTERFACE_IDS,
} = require("@erc725/erc725.js/build/main/src/lib/constants");

// Sample Addresses
const SAMPLE_PROFILE_ADDRESS = "0x0Ac71c67Fa5E4c9d4af4f99d7Ad6132936C2d6A3";
const SAMPLE_ASSET_ADDRESS = "0xfE85568Fea15A7ED3c56F7ca6544F2b96Aeb1774";

// Network & Storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";

// Parameters for ERC725 Instance
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

// Setup Web3
const web3 = new Web3("https://rpc.l14.lukso.network");

// Keys for asset properties
const TokenNameKey = LSP4schema[1].key;
const TokenSymbolKey = LSP4schema[2].key;
const MetaDataKey = LSP4schema[3].key;
const CreatorsKey = LSP4schema[4].key;

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

/*
 * Fetch the @param's Universal Profile's
 * issued assets
 *
 * @param address of Universal Profile
 * @return string JSON or custom error
 */
async function fetchIssuedAssets(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    return await (
      await profile.fetchData("LSP12IssuedAssets[]")
    ).value;
  } catch (error) {
    return console.log("This is not an ERC725 Contract");
  }
}

/*
 * Return array of blockchain addresses
 * of assets that are owned by the
 * Univeral Profile.
 *
 * @param owner Universal Profile address
 * @return address[] of owned assets
 */
async function fetchOwnedAssets(owner) {
  const digitalAssets = await fetchReceivedAssets(owner);
  const ownedAssets = [];

  for (let i = 0; i < digitalAssets.length; i++) {
    // Create instance of the asset to check owner balance
    const LSP8Contract = new web3.eth.Contract(LSP8.abi, digitalAssets[i]);

    const isCurrentOwner = await LSP8Contract.methods.balanceOf(owner).call();
    if (isCurrentOwner > 0) {
      ownedAssets[ownedAssets.length] = digitalAssets[i];
    }
  }
  return ownedAssets;
}

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

/*
 * Fetch the dataset of an asset
 *
 * @param key of asset property
 * @return string of encoded data
 */
async function getAssetData(key, address) {
  try {
    // Instantiate Digital Asset smart contract
    const digitalAsset = new web3.eth.Contract(LSP4.abi, address);

    // Fetch the encoded contract data
    return await digitalAsset.methods["getData(bytes32)"](key).call();
  } catch (error) {
    return console.error("Data of assets address could not be loaded");
  }
}

/*
 * Decode value from ERC725Y storage
 * based on it's key and phrase
 *
 * @param key of asset property
 * @param decodePhrase string of fetchable content
 * @return string of decoded data
 */
async function decodeAssetData(keyName, encodedData) {
  try {
    // instance for the digital asset with erc725.js
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
 * Create a fetchable link for the asset data
 * that was embeded into the JSON metadata
 *
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
 * Fetch the asset data from storage
 *
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

// Step 1
fetchReceivedAssets(SAMPLE_PROFILE_ADDRESS).then((profileData) =>
  console.log(JSON.stringify(profileData, undefined, 2))
);

// Step 2
fetchIssuedAssets(SAMPLE_PROFILE_ADDRESS).then((profileData) =>
  console.log(JSON.stringify(profileData, undefined, 2))
);

// Step 3
fetchOwnedAssets(SAMPLE_PROFILE_ADDRESS).then((ownedAssets) =>
  console.log(ownedAssets)
);

// Step 4
checkErc725YInterfaceId(SAMPLE_ASSET_ADDRESS).then((isERC725Y) =>
  console.log(isERC725Y)
);

// Step 5
getAssetData(MetaDataKey, SAMPLE_ASSET_ADDRESS).then((encodedData) =>
  console.log(encodedData)
);

// Step 6
getAssetData(MetaDataKey, SAMPLE_ASSET_ADDRESS).then((encodedData) => {
  decodeAssetData(MetaDataKey, encodedData).then((decodedData) =>
    console.log(decodedData)
  );
});

// Step 7
getAssetData(MetaDataKey, SAMPLE_ASSET_ADDRESS).then((encodedData) => {
  decodeAssetData(MetaDataKey, encodedData).then((decodedData) => {
    getMetaDataLink(decodedData).then((dataURL) => console.log(dataURL));
  });
});

// Step 8
getAssetData(MetaDataKey, SAMPLE_ASSET_ADDRESS).then((encodedData) => {
  decodeAssetData(MetaDataKey, encodedData).then((decodedData) => {
    getMetaDataLink(decodedData).then((dataURL) => {
      fetchAssetData(dataURL).then((assetJSON) => console.log(assetJSON));
    });
  });
});
