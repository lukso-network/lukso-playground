import { ethers } from 'hardhat';
import LSP8ABI from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';

import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

const ASSET_ADDRESS = '0x8734600968c7e7193BB9B1b005677B4edBaDcD18';

async function getAssetMetadata() {
  const token = await ethers.getContractAt(LSP8ABI.abi, ASSET_ADDRESS);

  const metadata = await token.getData(ERC725YDataKeys.LSP4.LSP4Metadata);
  console.log('metadata: ', metadata);

  const tokenIdMetadata = await token.getDataForTokenId(
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    ERC725YDataKeys.LSP4.LSP4Metadata,
  );
  console.log('tokenIdMetadata: ', tokenIdMetadata);
}

getAssetMetadata().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
