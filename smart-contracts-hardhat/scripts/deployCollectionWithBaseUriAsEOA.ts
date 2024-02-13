import { ethers } from 'hardhat';
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

import { BasicNFTCollection, BasicNFTCollection__factory } from '../typechain-types';

async function deployAndSetCollectionMetadata() {
  // Signer used for deployment
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contract with EOA: ', deployer.address);

  // Deploy the contract with custom constructor parameters
  const nftCollection: BasicNFTCollection = await new BasicNFTCollection__factory(deployer).deploy(
    'NFT Collection Name', // collection name
    'NFT', // collection symbol
    deployer.address, // owner
  );

  // Get the BaseURI data key of LSP8
  const baseURIDataKey = ERC725YDataKeys.LSP8['LSP8TokenMetadataBaseURI'];

  // Set the storage data on the deployed contract
  const tx = await nftCollection.setData(baseURIDataKey, ethers.toUtf8Bytes('ipfs://my-base-uri/'));

  // Wait for the transaction to be included in a block
  await tx.wait();

  const result = await nftCollection.getData(baseURIDataKey);
  console.log('Base URI set to: ', result);
}

deployAndSetCollectionMetadata().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
