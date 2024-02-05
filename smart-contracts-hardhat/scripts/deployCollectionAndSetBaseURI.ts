import { ethers } from 'hardhat';
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

import { BasicNFTCollection, BasicNFTCollection__factory } from '../typechain-types';

async function deployAndSetCollectionMetadata() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const nftCollection: BasicNFTCollection = await new BasicNFTCollection__factory(deployer).deploy(
    'NFT Collection Name', // collection name
    'NFT', // collection symbol
    deployer.address,
  );

  const baseURIDataKey = ERC725YDataKeys.LSP8['LSP8TokenMetadataBaseURI'];

  const tx = await nftCollection.setData(
    baseURIDataKey,
    ethers.toUtf8Bytes('ipfs://your-base-uri-on-ipf-goes-here/'),
  );

  await tx.wait();

  const result = await nftCollection.getData(baseURIDataKey);
  console.log('Base URI set to: ', result);
}

deployAndSetCollectionMetadata().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
