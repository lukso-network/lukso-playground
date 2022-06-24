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

// Sample addresses
const SAMPLE_PROFILE_ADDRESS = "0x0Ac71c67Fa5E4c9d4af4f99d7Ad6132936C2d6A3";
const SAMPLE_ASSET_ADDRESS = "0xfE85568Fea15A7ED3c56F7ca6544F2b96Aeb1774";

// Network and storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";

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
 * Fetch the ever issued assets from
 * the Universal Profile
 *
 * @param address of the Universal Profile
 * @return address[] of the issued assets or custom error
 */
async function fetchIssuedAssets(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    const result = await profile.fetchData("LSP12IssuedAssets[]");
    return result.value;
  } catch (error) {
    return console.log("This is not an ERC725 Contract");
  }
}

/*
 * Return an array of assets
 * that are owned by the
 * Universal Profile.
 *
 * @param owner of the Universal Profile
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
    console.log("Address could not be checked for ERC725Y interface");
  }

  return isERC725Y;
}

/*
 * Get the dataset of an asset
 *
 * @param data key of the property to fetch
 * @return string of the encoded data
 */
async function getAssetData(key, address) {
  try {
    // Instantiate the asset
    const digitalAsset = new web3.eth.Contract(LSP4.abi, address);

    // Get the encoded data
    return await digitalAsset.methods["getData(bytes32)"](key).call();
  } catch (error) {
    return console.error("Data of assets address could not be loaded");
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
    return decodedAssetMetadata.value.url.replace("ipfs://", IPFS_GATEWAY);
  } catch (error) {
    console.log("URL could not be fetched");
  }
}

/*
 * Fetch the asset data from the provided
 * storage link
 *
 * @param dataURL as string
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
