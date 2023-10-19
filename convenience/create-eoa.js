// Imports
import Web3 from 'web3';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';

// Setup Web3
const web3 = new Web3(RPC_ENDPOINT);

const myEOA = web3.eth.accounts.create();
console.log(myEOA);
