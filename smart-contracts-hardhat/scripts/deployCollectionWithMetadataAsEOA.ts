import { ethers, network } from 'hardhat';

import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';
import { ERC725 } from '@erc725/erc725.js';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

import { lsp4SampleMetadata } from '../consts/LSP4SampleMetadata';

interface CustomNetworkConfig {
  url?: string;
}

async function deployToken() {
  // Signer used for deployment
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract with EOA:', deployer.address);

  // Deploy the contract with custom constructor parameters
  const token = await ethers.deployContract('DigitalTradingCards');

  // Wait for the transaction to be included in a block
  await token.waitForDeployment();
  const customTokenAddress = await token.getAddress();
  console.log('Token deployed at :', customTokenAddress);

  // Get the ERC725Y data key of LSP4
  const metadataKey = ERC725YDataKeys.LSP4['LSP4Metadata'];

  // Setup network parameters for ERC725
  const customNetworkConfig = network.config as CustomNetworkConfig;
  const networkUrl = customNetworkConfig.url;

  if (!networkUrl) {
    throw new Error('Network URL is not defined in the Hardhat configuration.');
  }

  const erc725js = new ERC725(
    LSP4DigitalAssetSchema,
    customTokenAddress,
    networkUrl,
  );

  // Read the token metadata
  // https://docs.lukso.tech/tools/erc725js/classes/ERC725#getdata
  const metadata = await erc725js.getData(metadataKey);
  console.log('Token metadata: ', metadata);

  // Encode the new LSP4 metadata as Verifiable URI
  // https://docs.lukso.tech/tools/erc725js/classes/ERC725#encodedata
  const encodedLSP4Metadata = ERC725.encodeData(
    lsp4SampleMetadata,
    LSP4DigitalAssetSchema,
  );

  // Write the new metadata into the ERC725Y storage
  // https://docs.lukso.tech/contracts/contracts/ERC725/#setdatabatch
  const tx = await token.setDataBatch(
    encodedLSP4Metadata.keys,
    encodedLSP4Metadata.values,
  );

  // Wait for the transaction to be included in a block
  const receipt = await tx.wait();

  console.log('Token metadata updated:', receipt);
}

deployToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
