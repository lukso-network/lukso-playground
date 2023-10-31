import Web3 from 'web3';

// Import schemas and ABI
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json';

const web3 = new Web3(window.ethereum);

await web3.eth.requestAccounts();
const accounts = await web3.eth.getAccounts();

// Instanciate the token with an address
const myToken = new web3.eth.Contract(LSP7Mintable.abi, '0x...');

// Send the token transaction
await myToken.methods
  .transfer(
    accounts[0], // sender address
    '0x...', // receiving address
    15, // token amount
    false, // force parameter
    '0x', // additional data
  )
  .send({ from: accounts[0] });
