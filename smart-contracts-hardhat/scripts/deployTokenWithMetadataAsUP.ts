import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';
import { ERC725 } from '@erc725/erc725.js';
import LSP0Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

import { lsp4SampleMetadata } from '../consts/LSP4SampleMetadata';

// Load environment variables
dotenv.config();

async function deployTokenWithMetadata() {
  // UP controller used for deployment
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract with Universal Profile controller: ', deployer.address);

  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    LSP0Artifact,
    process.env.UP_ADDR as string,
  );

  // Create custom bytecode for the token deployment
  const tokenBytecode = (await ethers.getContractFactory('MyCustomToken')).bytecode;
  const abiEncoder = new ethers.AbiCoder();

  // Encode constructor parameters
  const encodedConstructorParams = abiEncoder.encode(
    ['string', 'string', 'address', 'uint256', 'bool'],
    [
      'My Custom Token', // token name
      'MCT', // token symbol
      process.env.UP_ADDR, // token owner
      0, // token type = TOKEN
      false, // isNonDivisible?
    ],
  );

  // Add the constructor parameters to the token bytecode
  const tokenBytecodeWithConstructor = tokenBytecode + encodedConstructorParams.slice(2);

  // Get the address of the custom token contract that will be created
  const customTokenAddress = await universalProfile.execute.staticCall(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    tokenBytecodeWithConstructor, // Payload of the contract
  );

  // Encode the metadata for deployment
  const encodedLSP4Metadata = ERC725.encodeData(lsp4SampleMetadata, LSP4DigitalAssetSchema);

  // Set up the token contract
  const token = await ethers.getContractAt('MyCustomToken', customTokenAddress);

  // Get the ERC725Y data key of LSP4
  const metadataKey = ERC725YDataKeys.LSP4['LSP4Metadata'];

  // Create the transaction payload for setting storage data
  const lsp4StorageBytecode = token.interface.encodeFunctionData('setData', [
    metadataKey,
    encodedLSP4Metadata.values[0],
  ]);

  // Deploy the contract by the Universal Profile
  const tx = await universalProfile.executeBatch(
    [
      // Array of Operation types
      1, // Operation type: CREATE (Contract deployment)
      0, // Operation type: CALL (Set storage key on contract)
    ],
    [
      ethers.ZeroAddress, // 0x0 as contract will be initialized
      customTokenAddress, // Contract address after deployment
    ],
    [0, 0], // Value is empty for both operations
    [
      tokenBytecodeWithConstructor, // Payload for contract deployment
      lsp4StorageBytecode, // Payload for setting a data key on the deployed contract
    ],
  );

  // Wait for the transaction to be included in a block
  await tx.wait();
  console.log('Token deployed at: ', customTokenAddress);
}

deployTokenWithMetadata()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
