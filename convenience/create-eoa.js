// Static variables
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";

// Import and Network Setup
const Web3 = require("web3");
const web3 = new Web3(RPC_ENDPOINT);

// Create EOA
const myEOA = web3.eth.accounts.create();
console.log(myEOA);
