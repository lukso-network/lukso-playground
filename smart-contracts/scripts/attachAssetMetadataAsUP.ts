import { ethers, network } from 'hardhat';
import * as dotenv from 'dotenv';

import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';
import { ERC725 } from '@erc725/erc725.js';
import UniversalProfileArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

import { lsp4SampleMetadata } from '../consts/LSP4SampleMetadata';

interface CustomNetworkConfig {
  url?: string;
}

// Load the environment variables
dotenv.config();

async function attachAssetMetadata(myAssetAddress: string) {
  // UP controller used for deployment
  const [signer] = await ethers.getSigners();
  console.log('Updating metadata with Universal Profile Controller: ', signer.address);

  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    UniversalProfileArtifact,
    process.env.UP_ADDR as string,
  );

  // Set up the token contract at an existing address
  const token = await ethers.getContractAt('MyCustomToken', myAssetAddress);

  // Get the ERC725Y data key of LSP4
  const metadataKey = ERC725YDataKeys.LSP4['LSP4Metadata'];

  // Read the current token metadata
  const customNetworkConfig = network.config as CustomNetworkConfig;
  const networkUrl = customNetworkConfig.url;

  if (!networkUrl) {
    throw new Error('Network URL is not defined in the Hardhat configuration.');
  }

  const erc725js = new ERC725(LSP4DigitalAssetSchema, myAssetAddress, networkUrl);

  // Read the current token metadata
  // https://docs.lukso.tech/tools/erc725js/classes/ERC725#getdata
  const currentMetadata = await erc725js.getData(metadataKey);
  console.log('Current token metadata:', currentMetadata);

  // Encode the new metadata
  const encodedLSP4Metadata = ERC725.encodeData(lsp4SampleMetadata, LSP4DigitalAssetSchema);

  // Create the transaction payload for the contract call
  const setDataPayload = token.interface.encodeFunctionData('setData', [
    metadataKey,
    encodedLSP4Metadata.values[0],
  ]);

  // Update the ERC725Y storage of the LSP4 metadata
  // https://docs.lukso.tech/contracts/contracts/ERC725/#execute
  const tx = await universalProfile.execute(
    0, // Operation type: CALL
    myAssetAddress, // Target: asset address
    0, // Value is empty
    setDataPayload, // bytecode to be executed
  );

  // Wait for the transaction to be included in a block
  const receipt = await tx.wait();
  console.log('Token metadata updated: ', receipt);
}

attachAssetMetadata('0x...' /* Your custom asset address */)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
