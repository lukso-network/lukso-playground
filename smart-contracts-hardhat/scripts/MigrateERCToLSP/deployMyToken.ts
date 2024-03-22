import { config as loadConfig } from 'dotenv';
import EcoCoinArtifacts from '../../artifacts/contracts/MigrateERCToLSP/ERC20ToLSP7.sol/EcoCoinAsLSP7.json';

import { ethers } from 'ethers';

loadConfig();

const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.gateway.fm');

const SIGNER = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

async function deployMyToken() {
  const myTokenFactory = new ethers.ContractFactory(
    EcoCoinArtifacts.abi,
    EcoCoinArtifacts.bytecode,
    SIGNER,
  );

  const myDeployedToken = await myTokenFactory.deploy(SIGNER.address);
  await myDeployedToken.waitForDeployment();

  console.log('deploying token contract... ⏳');
  console.log('EcoCoin deployed at: ', await myDeployedToken.getAddress());
}
deployMyToken();
