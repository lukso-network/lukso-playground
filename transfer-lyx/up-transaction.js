import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
const Web3 = require('web3');

// Connect to the mainnet or testnet
const provider = new Web3('https://rpc.testnet.lukso.gateway.fm');

// Instanciate Universal Profile
const myUniversalProfile = new provider.eth.Contract(
  UniversalProfile.abi, // contract ABI of Universal Profiles
  '0x...', // address of the user's profile
);

// Transaction Data
const operation_type = 0; // operation of type CALL
const recipient = '0x...'; // address including profiles and vaults
const data = '0x'; // executed payload, empty for regular transfer
const amount = provider.utils.toWei('3'); // amount in LYX

// Get the controller address of the Universal Profile
const accounts = await window.ethereum.request({
  method: 'eth_requestAccounts',
});

// Call the execute function of the profile to send the LYX transaction
await myUniversalProfile.methods
  .execute(operation_type, recipient, amount, data)
  .send({
    from: accounts[0], // address of the active controller key
    gasLimit: 300_000, // gas limit of the transaction
  });
