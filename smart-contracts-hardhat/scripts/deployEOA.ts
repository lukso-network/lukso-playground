import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const customToken = await ethers.deployContract('CustomToken');

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
