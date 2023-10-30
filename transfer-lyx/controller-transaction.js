const Web3 = require('web3');

// Connect to the mainnet or testnet
const provider = new Web3('https://rpc.testnet.lukso.gateway.fm');

// Get the controller address of the Universal Profile
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts',
});

await provider.eth.sendTransaction({
  from: accoutns[0], // active controller key
  to: '0x...', // receiving address
  value: web3.utils.toWei('0.001', 'ether'), // amount in LYX
});
