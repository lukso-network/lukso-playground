import { ethers, network } from 'hardhat';
import { ERC725 } from '@erc725/erc725.js';

import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import LSP8Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

interface CustomNetworkConfig {
  url?: string;
}

// Sample LSP8 NFTs based on the selected Hardhat network
enum SAMPLE_LSP8_ASSET {
  'luksoTestnet' = '0x8734600968c7e7193BB9B1b005677B4edBaDcD18',
  'luksoMainnet' = '0x86e817172b5c07f7036bf8aa46e2db9063743a83',
}

// Token ID 1 (as Bytes 32)
const SAMPLE_TOKEN_ID = '0x0000000000000000000000000000000000000000000000000000000000000001';

async function getAssetMetadata() {
  // Setup network parameters for ERC725
  const customNetworkConfig = network.config as CustomNetworkConfig;
  const networkUrl = customNetworkConfig.url;

  if (!networkUrl) {
    throw new Error('Network URL is not defined in the Hardhat configuration.');
  }

  try {
    // Create contract instance from ERC725
    const myAsset = new ERC725(
      LSP4DigitalAssetSchema,
      SAMPLE_LSP8_ASSET[network.name as keyof typeof SAMPLE_LSP8_ASSET],
      networkUrl,
    );

    // Get the ERC725Y data key of LSP4
    const metadataKey = ERC725YDataKeys.LSP4['LSP4Metadata'];

    // Read LSP4 token metadata
    const metadata = await myAsset.getData(metadataKey);

    // Data gets decoded by ERC725 library automatically
    console.log('Asset metadata:', metadata);

    // Read LSP4 metadata of a specific token ID
    const token = await ethers.getContractAt(
      LSP8Artifact.abi,
      SAMPLE_LSP8_ASSET[network.name as keyof typeof SAMPLE_LSP8_ASSET],
    );

    // Specific IDs have to be read from contract directly
    const rawTokenIdMetadata = await token.getDataForTokenId(SAMPLE_TOKEN_ID, metadataKey);

    // Decode ID-specific metadata manually
    const tokenIdMetadata = myAsset.decodeData([
      {
        keyName: metadataKey,
        value: rawTokenIdMetadata,
      },
    ]);
    console.log('tokenIdMetadata: ', tokenIdMetadata);
  } catch {
    console.log('No sample address provided for the current Hardhat network');
  }
}

getAssetMetadata().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
