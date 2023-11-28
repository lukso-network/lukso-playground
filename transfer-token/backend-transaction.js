import Web3 from 'web3';

// Import schemas and ABI
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json' assert { type: 'json' };
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json' assert { type: 'json' };

// Connect to the mainnet or testnet
const web3 = new Web3('https://rpc.testnet.lukso.gateway.fm');

// Get the controller key of the Universal Profile
const controller = '0x...';

// Instanciate the profile contract with an address
const myUniversalProfile = new web3.eth.Contract(UniversalProfile.abi, '0x...');

// Instanciate the token contract with an address
const myToken = new web3.eth.Contract(LSP7Mintable.abi, '0x...');

// Generate the calldata to token transfer
const tokenCalldata = myToken.methods
  .transfer(
    '0x...', // sending address
    '0x...', // receiving address
    15, // token amount
    false, // force parameter
    '0x', // additional data
  )
  .encodeABI();

/**
 * Call the execute function of the profile to send the LYX transaction
 * Will forward to the LSP6 Key Manager to check permissions of the controller
 */
await myUniversalProfile.methods
  .execute(
    0, //operation of type CALL
    '0x...', // recipient address including profiles and vaults
    0, // amount in LYX
    tokenCalldata, // contract calldata, empty for regular transfer
  )
  .send({
    from: controller, // address of the active controller key
    gasLimit: 500_000, // gas limit of the transaction
  });
