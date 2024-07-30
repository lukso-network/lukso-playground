import { ethers } from 'ethers';

const RPC_URL = 'https://rpc.testnet.lukso.network';
const provider = new ethers.JsonRpcProvider(RPC_URL);

import { abi as LSP16UniversalFactoryABI } from '@lukso/lsp-smart-contracts/artifacts/LSP16UniversalFactory.json';
import {
  abi as TargetContractABI,
  bytecode as targetContractBytecode,
} from './TargetContract.json';

// The private key should not be comitted to a public GitHub repository.
const signer = new ethers.Wallet('<private-key>', provider);

// For more information check: https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-16-UniversalFactory.md
const LSP16_FACTORY_ADDRESS = '0x1600016e23e25D20CA8759338BfB8A8d11563C4e';

const lsp16UniversalFactory = new ethers.Contract(
  LSP16_FACTORY_ADDRESS,
  LSP16UniversalFactoryABI,
  signer,
);

// Dummy value
const constructorArgument = 123;
const encodedConstructorArg = ethers.AbiCoder.defaultAbiCoder().encode(
  ['uint256'],
  [constructorArgument],
);

const contractBytecodeWithArg =
  targetContractBytecode + encodedConstructorArg.substring(2);

// On each script run, this salt should be different otherwise the deployment will fail
// Don't use random bytes as salt, use a deterministic salt to be able to deploy on a different network
// using the same salt, to produce the same address
// Should be a hex string like 0x1322322... (32 bytes)
const deploymentSalt = '<bytes32-salt>';

// Precompute the address of the contract to be deployed without initialization
const precomputedAddressWithoutInit =
  await lsp16UniversalFactory.computeAddress(
    ethers.keccak256(contractBytecodeWithArg),
    deploymentSalt,
    false, // --> boolean indicating if the contract should be initialized or not after deployment
    '0x', // --> bytes representing the calldata to initialize the contract
  );

// Deploy contract without initialization
const deployTxWithoutInit = await lsp16UniversalFactory.deployCreate2(
  contractBytecodeWithArg,
  deploymentSalt,
);
await deployTxWithoutInit.wait();

const contractWithoutInit = new ethers.Contract(
  precomputedAddressWithoutInit,
  TargetContractABI,
  signer,
);

const numberInContractWithoutInit = await contractWithoutInit.number();
console.log(
  'The number in the non-initialized contract is: ',
  numberInContractWithoutInit,
);
