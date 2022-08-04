// Imports
const Web3 = require("web3");
const { ERC725 } = require("@erc725/erc725.js");
const { LSPFactory } = require("@lukso/lsp-factory.js");
const UniversalProfile = require("@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json");
const KeyManager = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");

// Static variables
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";
const IPFS_GATEWAY = "https://2eff.lukso.dev/ipfs/";
const CHAIN_ID = 2828;
const PRIVATE_KEY = "0x..."; // from ../convenience/create-eoa.js
const UNIVERSAL_PROFILE_ADDRESS = "0x...";

// Setup Web3
const web3 = new Web3(RPC_ENDPOINT);

// Step 1 - Create a new LSP3Profile JSON file
const jsonFile = require("./sample-metadata.json");

const lspFactory = new LSPFactory(RPC_ENDPOINT, {
  deployKey: PRIVATE_KEY,
  chainId: CHAIN_ID,
});

async function editProfileInfo() {
  // Step 2 - Upload our JSON file to IPFS
  const uploadResult = await lspFactory.UniversalProfile.uploadProfileData(
    jsonFile.LSP3Profile
  );

  const lsp3ProfileIPFSUrl = uploadResult.url;

  // Step 3.1 - Setup erc725.js
  const schema = [
    {
      name: "LSP3Profile",
      key: "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
      keyType: "Singleton",
      valueContent: "JSONURL",
      valueType: "bytes",
    },
  ];

  const erc725 = new ERC725(schema, UNIVERSAL_PROFILE_ADDRESS, web3.currentProvider, {
    ipfsGateway: IPFS_GATEWAY,
  });

  // Step 3.2 - Encode the LSP3Profile data (to be written on our UP)
  const encodedData = erc725.encodeData({
    keyName: "LSP3Profile",
    value: {
      hashFunction: "keccak256(utf8)",
      // Hash our LSP3 metadata JSON file
      hash: web3.utils.keccak256(JSON.stringify(jsonFile)),
      url: lsp3ProfileIPFSUrl,
    },
  });

  // Step 4.1 - Load our EOA
  const myEOA = web3.eth.accounts.wallet.add(PRIVATE_KEY);
  console.log("EOA:", myEOA.address);

  // Step 4.2 - Create instances of our Contracts
  const universalProfileContract = new web3.eth.Contract(
    UniversalProfile.abi,
    UNIVERSAL_PROFILE_ADDRESS
  );

  const keyManagerAddress = await universalProfileContract.methods
    .owner()
    .call();
  const keyManagerContract = new web3.eth.Contract(
    KeyManager.abi,
    keyManagerAddress
  );

  // Step 4.3 - Set updated LSP3Profile metadata to our Universal Profile

  // encode the setData payload
  const abiPayload = await universalProfileContract.methods[
    "setData(bytes32[],bytes[])"
  ](encodedData.keys, encodedData.values).encodeABI();

  // execute via the KeyManager, passing the UP payload
  await keyManagerContract.methods
    .execute(abiPayload)
    .send({ from: myEOA.address, gasLimit: 300_000 });
}

editProfileInfo();
