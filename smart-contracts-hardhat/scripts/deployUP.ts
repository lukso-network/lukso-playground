import hre from 'hardhat';
import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';
import LSP0Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';

// load env vars
dotenv.config();

async function main() {
  // Setup the provider
  const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.gateway.fm');

  // Setup the controller used to sign the deployment
  const [signer] = await ethers.getSigners();
  console.log('Deploying contracts with Universal Profile Controller: ', signer.address);

  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    LSP0Artifact,
    process.env.UP_ADDR as string,
  );

  /**
   * Custom LSP7 Token
   */

  // Create custom bytecode for the token deployment
  const CustomTokenBytecode = hre.artifacts.readArtifactSync('MyCustomToken').bytecode;

  const abiEncoder = new ethers.AbiCoder();

  // Encode constructor params
  const encodedConstructorParams = abiEncoder.encode(
    ['string', 'string', 'address', 'uint256', 'bool'],
    [
      'My Custom Token', // token name
      'MCT', // token symbol
      process.env.UP_ADDR, // token owner
      0, // token type = TOKEN
      false, // isNonDivisible?
    ],
  );

  // Add the constructor params to the Custom Token bytecode
  const CustomTokenBytecodeWithConstructor =
    CustomTokenBytecode + encodedConstructorParams.slice(2);

  // Get the address of the custom token contract that will be created
  const CustomTokenAddress = await universalProfile
    .connect(signer)
    .getFunction('execute')
    .staticCall(
      1, // Operation type: CREATE
      ethers.ZeroAddress,
      0, // Value is empty
      CustomTokenBytecodeWithConstructor,
      { gasLimit: 10000000 },
    );

  // Deploy the contract by the Universal Profile
  const tx = await universalProfile.connect(signer).getFunction('execute')(
    1, // Operation type: CREATE
    ethers.ZeroAddress,
    0, // Value is empty
    CustomTokenBytecodeWithConstructor,
    { gasLimit: 10000000 },
  );

  await tx.wait();

  console.log('Custom token address: ', CustomTokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
