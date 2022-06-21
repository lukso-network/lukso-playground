// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
require("isomorphic-fetch");
const erc725schema = require("@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json");
const LSP8 = require("@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json");
const LSP4schema = require("@erc725/erc725.js/schemas/LSP4DigitalAsset.json");

// Sample Addresses
const SAMPLE_ASSET_ADDRESS = "0xc444009d38d3046bb0cF81Fa2Cd295ce46A67C78";
const SAMPLE_PROFILE_ADDRESS = "0x0C03fBa782b07bCf810DEb3b7f0595024A444F4e";

// Network & Storage
const RPC_ENDPOINT = "https://rpc.l14.lukso.network";
const IPFS_GATEWAY = "https://cloudflare-ipfs.com/ipfs/";

// Legacy Schemas
const LSP1MinimalInterface = require("./lsp1_legacy_minimal_interface.json");
const AssetInterface = require("./lsp4_legacy_minimal_interface.json");
const ERC725LegacyInterface = require("./erc725_legacy_minimal_interface.json");

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
 * LSP1 data for the Universal Receiver
 *
 * @param address of Universal Profile
 * @return Universal Receiver address or custom error
 */
async function fetchUniversalReceiver(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    return await (
      await profile.fetchData("LSP1UniversalReceiverDelegate")
    ).value;
  } catch (error) {
    return console.log("This is not an ERC725 Contract");
  }
}

/*
 * Return array of blockchain addresses of
 * assets, that were received by the
 * Univeral Profile holder.
 *
 * @return address[] of assets
 */
async function fetchReceivedAssets(receiverAddress) {
  const universalReceiver = new web3.eth.Contract(
    LSP1MinimalInterface,
    receiverAddress
  );

  let rawValues = [];

  try {
    // Fetch all raw values
    rawValues = await universalReceiver.methods.getAllRawValues().call();
  } catch (error) {
    return console.log("Data from universal receiver could not be loaded");
  }

  const receivedAssets = [];

  // Retrieve addresses
  for (let i = 0; i < rawValues.length; i++) {
    receivedAssets[i] = web3.utils.toChecksumAddress(rawValues[i].substr(26));
  }
  return receivedAssets;
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
  const receiverAddress = await fetchUniversalReceiver(owner);
  const digitalAssets = await fetchReceivedAssets(receiverAddress);
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
 * Check the interface of an
 * asset's smart contract
 *
 * @param address of asset
 * @return object of interface types
 */
async function checkErc725YInterfaceId(address) {
  // Create instance of the contract which has to be queried
  const asset = new web3.eth.Contract(AssetInterface, address);

  const erc725YLegacyInterfaceId = "0x2bd57b73";

  // Check if the contract is a legacy key-value store interface
  try {
    let isERC725YLegacy = false;
    isERC725YLegacy = await asset.methods
      .supportsInterface(erc725YLegacyInterfaceId)
      .call();
    return isERC725YLegacy;
  } catch (error) {
    return error; //console.log("Address could not be checked for legacy interface");
  }
}

/*
 * Fetch the dataset of an asset
 * from the Universal Profile
 *
 * @param key of asset property
 * @return string of encoded data
 */
async function getAssetData(key, address) {
  // Check if asset is ERC725Legacy or ERC725
  let assetInterfaceID = await checkErc725YInterfaceId(address);

  try {
    // Legacy interface
    if (assetInterfaceID === true) {
      // Instanciate ERC725Legacy smart contract
      const digitalAsset = new web3.eth.Contract(
        ERC725LegacyInterface,
        address
      );

      // Fetch the encoded contract data
      return await digitalAsset.methods.getData(key).call();
    } else {
      return console.log("Address does not have an ERC725 interface");
    }
  } catch (error) {
    return console.log("Data of assets address could not be loaded");
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

// Step 1.1
fetchUniversalReceiver(SAMPLE_PROFILE_ADDRESS).then((receiverAddress) =>
  console.log(receiverAddress)
);

// Step 1.2
fetchUniversalReceiver(SAMPLE_PROFILE_ADDRESS).then((receiverAddress) => {
  fetchReceivedAssets(receiverAddress).then((receivedAssets) =>
    console.log(receivedAssets)
  );
});

// Step 2
// TODO

// Step 3
fetchOwnedAssets(SAMPLE_PROFILE_ADDRESS).then((ownedAssets) =>
  console.log(ownedAssets)
);

// Step 4
checkErc725YInterfaceId(SAMPLE_ASSET_ADDRESS).then((isLegacy) =>
  console.log(isLegacy)
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
