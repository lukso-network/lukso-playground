import { config as LoadEnv } from 'dotenv';
import { ContractFactory, JsonRpcProvider, Wallet } from 'ethers';

import EcoCoinAsLSP7 from '../../artifacts/contracts/MigrateERCToLSP/ERC20ToLSP7.sol/EcoCoinAsLSP7.json';

LoadEnv();

const provider = new JsonRpcProvider('https://rpc.testnet.lukso.gateway.fm');

const SIGNER = new Wallet(process.env.PRIVATE_KEY as string, provider);
console.log('signer address: ', SIGNER.address);

const tokenContractFactory = new ContractFactory(
  EcoCoinAsLSP7.abi,
  EcoCoinAsLSP7.bytecode,
  SIGNER,
);

async function deployTokenContract() {
  const tokenContract = await tokenContractFactory.deploy(SIGNER.address);
  console.log(
    'token contract deployed at: ' + (await tokenContract.getAddress()),
  );
}

deployTokenContract();
