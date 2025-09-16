import { ethers, network } from 'hardhat';
import * as dotenv from 'dotenv';

import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';
import { ERC725 } from '@erc725/erc725.js';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

import { lsp4SampleMetadata } from '../consts/LSP4SampleMetadata';

interface CustomNetworkConfig {
  url?: string;
}

// Load the environment variables
dotenv.config();

async function attachAssetMetadata(myAssetAddress: string) {
  // Signer used for deployment
  const [signer] = await ethers.getSigners();
  console.log('Updating metadata with EOA: ', signer.address);

  // Set up the token contract
  const token = await ethers.getContractAt('MyCustomToken', myAssetAddress);

  // Get the ERC725Y data key of LSP4
  const metadataKey = ERC725YDataKeys.LSP4['LSP4Metadata'];

  // Setup network parameters for ERC725
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
  // https://docs.lukso.tech/tools/erc725js/classes/ERC725#encodedata
  const encodedLSP4Metadata = erc725js.encodeData(lsp4SampleMetadata);

  // Update the ERC725Y storage of the LSP4 metadata
  // https://docs.lukso.tech/contracts/contracts/ERC725/#setdatabatch
  const tx = await token.setDataBatch(encodedLSP4Metadata.keys, encodedLSP4Metadata.values);

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
