import { ethers } from 'hardhat';

import { LSP4_TOKEN_TYPES, ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

async function deployToken() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying Digital Trading Cards contract with the account:', deployer.address);

  const token = await ethers.deployContract('DigitalTradingCards');

  await token.waitForDeployment();

  console.log('Token address:', await token.getAddress());

  // read metadata
  const metadata = await token.getData(ERC725YDataKeys.LSP4['LSP4Metadata']);
  console.log('Token metadata:', metadata);

  // write metadata (should be a VerifiableURI)
  const tx = await token.setData(ERC725YDataKeys.LSP4['LSP4Metadata'], '0xcafecafe');
  const receipt = await tx.wait();

  console.log('Token metadata updated:', receipt);
}

deployToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
