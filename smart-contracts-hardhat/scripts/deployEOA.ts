import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  const customToken = await ethers.deployContract('MyCustomToken', [
    'My Custom Token',  // token name
    'MCT',              // token symbol
    deployer.address,   // contract owner
    0,                  // token type = TOKEN
    false,              // isNonDivisible?
  ]);

  await customToken.waitForDeployment();
  const CustomTokenAddress = await customToken.getAddress();
  console.log(`Token address: ${CustomTokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
