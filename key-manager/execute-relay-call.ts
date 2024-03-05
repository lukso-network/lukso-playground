import { ethers } from 'ethers';

import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import KeyManagerContract from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import { EIP191Signer } from '@lukso/eip191-signer.js';

// This is the version relative to the LSP25 standard, defined as the number 25.
import { LSP25_VERSION } from '@lukso/lsp-smart-contracts/constants';

const provider = new ethers.JsonRpcProvider(
  'https://rpc.testnet.lukso.network',
);
const universalProfileAddress = '0x...';
const recipientAddress = '0x...';

// Setup the Universal Profile controller account
const controllerPrivateKey = '0x...';
const controllerAccount = new ethers.Wallet(controllerPrivateKey).connect(
  provider,
);

// Setup the contract instance of the Universal Profile
const universalProfile = new ethers.Contract(
  universalProfileAddress,
  UniversalProfileContract.abi,
  controllerAccount,
);

// Call the Universal Profile contract to get the Key Manager
const keyManagerAddress = await universalProfile.owner();
console.log('Key Manager Address: ', keyManagerAddress);

// Setup the contract instance of the Key Manager
const keyManager = new ethers.Contract(
  keyManagerAddress,
  KeyManagerContract.abi,
  controllerAccount,
);

const channelId = 0;

// Retrieve the nonce of the EOA controller
const nonce = await keyManager.getNonce(controllerAccount.address, channelId);

const validityTimestamps = 0; // No validity timestamp set
const msgValue = 0; // Amount of native tokens to fund the UP with while calling

// Generate the payload of the transaction
const abiPayload = universalProfile.interface.encodeFunctionData('execute', [
  0, // Operation type: CALL
  recipientAddress, // Recipient
  ethers.parseEther('3'), // transfer 3 LYX to recipient
  '0x', // Optional transaction data
]);

// Get the network ID
const { chainId } = await provider.getNetwork();

// Encode the Message
const encodedMessage = ethers.solidityPacked(
  // Types of the parameters that will be encoded
  ['uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes'],
  [
    // MUST be number `25`
    // Encoded value: `0x0000000000000000000000000000000000000000000000000000000000000019`
    LSP25_VERSION,

    // e.g: `4201` for LUKSO Testnet
    // Encoded value: `0x0000000000000000000000000000000000000000000000000000000000001069`
    chainId,

    // e.g: nonce number 5 of the signing controller that wants to execute the payload
    // Encoded value: `0x0000000000000000000000000000000000000000000000000000000000000005`
    nonce,

    // e.g: valid until 1st January 2025 at midnight (GMT).
    // Timestamp = 1735689600
    // Encoded value: `0x0000000000000000000000000000000000000000000000000000000067748580`
    validityTimestamps,

    // e.g: not funding the contract with any LYX (0)
    // Encoded value: `0x0000000000000000000000000000000000000000000000000000000000000000`
    msgValue,

    // e.g: send 3 LYX to address 0xcafecafecafecafecafecafecafecafecafecafe
    // by calling execute(uint256,address,uint256,bytes)
    // Encoded value: `0x44c028fe00000000000000000000000000000000000000000000000000000000
    //                 00000000000000000000000000000000cafecafecafecafecafecafecafecafeca
    //                 fecafecafecafe00000000000000000000000000000000000000000000000029a2
    //                 241af62c0000000000000000000000000000000000000000000000000000000000
    //                 000000008000000000000000000000000000000000000000000000000000000000
    //                 00000000`
    abiPayload,
  ],
);

// Instanciate EIP191 Signer
const eip191Signer = new EIP191Signer();

/**
 * Create signature of the transaction payload using:
 * - Key Manager Address
 * - Message (LSP6 version, chain ID, noce, timestamp, value, payload)
 * - private key of the controller
 */
const { signature } = await eip191Signer.signDataWithIntendedValidator(
  keyManagerAddress,
  encodedMessage,
  controllerPrivateKey,
);

/**
 * Execute relay call transaction
 *
 * In this example script, we will
 * use the same controller that created
 * the transaction
 */
const executeRelayCallTransaction = await keyManager
  .connect(controllerAccount)
  // @ts-expect-error Ethers BaseContract does not pick dynamic types from ABIs
  .executeRelayCall(signature, nonce, validityTimestamps, abiPayload);

const receipt = await executeRelayCallTransaction.wait();

if (receipt.status === 1 || receipt.status === true) {
  console.log('Transaction successful');
} else {
  console.log('Transaction failed');
}
