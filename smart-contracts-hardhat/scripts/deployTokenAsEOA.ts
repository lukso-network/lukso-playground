import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function deployToken() {
  // Signer used for deployment
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract with EOA: ', deployer.address);

  // Deploy the contract with custom constructor parameters
  const customToken = await ethers.deployContract('MyCustomToken', [
    'My Custom Token', // token name
    'MCT', // token symbol
    deployer.address, // owner
    0, // token type = TOKEN
    false, // isNonDivisible?
  ]);

  // Wait for the transaction to be included in a block
  await customToken.waitForDeployment();
  const customTokenAddress = await customToken.getAddress();
  console.log('Token deployed at: ', customTokenAddress);
}

deployToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
