// Import and Setup
const Web3 = require("web3");
const web3 = new Web3();

const myEOA = web3.eth.accounts.create();
console.log(myEOA);
