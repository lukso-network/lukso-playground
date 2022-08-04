// Imports
const Web3 = require("web3");

// Static variables
const RPC_ENDPOINT = "https://rpc.l16.lukso.network";

// Setup Web3
const web3 = new Web3(RPC_ENDPOINT);

const myEOA = web3.eth.accounts.create();
console.log(myEOA);