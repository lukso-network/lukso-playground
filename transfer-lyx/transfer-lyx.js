// Imports
const Web3 = require("web3");
const UniversalProfile = require("@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json");
const KeyManager = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");

// Static variables
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";
const UNIVERSAL_PROFILE_ADDRESS = "0x...";

// Setup Web3
const web3 = new Web3(RPC_ENDPOINT);

// 1. instantiate your contracts
const myUP = new web3.eth.Contract(UniversalProfile.abi, UNIVERSAL_PROFILE_ADDRESS);

// the KeyManager is the owner of the Universal Profile
// so get the address of the KeyManager by calling the owner() function
const owner = myUP.methods.owner().call();

const myKM = new web3.eth.Contract(KeyManager.abi, owner);

const OPERATION_CALL = 0;
const recipient = "0x..."; // address the recipient (any address, including an other UP)
const amount = web3.utils.toWei("3");
// payload executed at the target (here nothing, just a plain LYX transfer)
const data = "0x";

// 2. encode the payload to transfer 3 LYX from the UP
const transferLYXPayload = await myUP.methods
  .execute(OPERATION_CALL, recipient, amount, data)
  .encodeABI();

// 3. execute the LYX transfer via the Key Manager
await myKM.execute(transferLYXPayload).send({
  // Connected wallet with EOA address that can send funds from UP
  from: "<my-wallet-address>",
  gasLimit: 300_00,
});
