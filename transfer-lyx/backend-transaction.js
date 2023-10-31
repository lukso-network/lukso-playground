// Building the transaction for a service backend
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import Web3 from 'web3';

// Connect to the mainnet or testnet
const web3 = new Web3('https://rpc.testnet.lukso.gateway.fm');

// Get the controller key of the Universal Profile
const controller = '0x...';

// Instanciate Universal Profile
const myUniversalProfile = new web3.eth.Contract(
  UniversalProfile.abi, // contract ABI of Universal Profiles
  '0x...', // address of the user's profile
);

/**
 * Call the execute function of the profile to send the LYX transaction
 * Will forward to the LSP6 Key Manager to check permissions of the controller
 */
await myUniversalProfile.methods
  .execute(
    0, // operation of type CALL
    '0x...', // recipient address including profiles and vaults
    web3.utils.toWei('3'), // amount in LYX
    '0x...', // contract calldata, empty for regular transfer
  )
  .send({
    from: controller, // address of the active controller key
    gasLimit: 300_000, // gas limit of the transaction
  });
