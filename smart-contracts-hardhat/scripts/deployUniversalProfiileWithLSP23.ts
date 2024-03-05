// libs
import { ethers } from 'hardhat';
import { AbiCoder } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';

// LSPs Smart Contracts artifacts

import LSP23FactoryArtifact from '@lukso/lsp-smart-contracts/artifacts/LSP23LinkedContractsFactory.json';
import UniversalProfileInitArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfileInit.json';

// ERC725.js Metadata schemas

import LSP1UniversalReceiverDelegateSchemas from '@erc725/erc725.js/schemas/LSP1UniversalReceiverDelegate.json';
import LSP3ProfileMetadataSchemas from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import LSP6KeyManagerSchemas from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

// Constants
import {
  LSP23_FACTORY_ADDRESS_TESTNET,
  UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS_TESTNET,
  LSP23_POST_DEPLOYMENT_MODULE_ADDRESS_TESTNET,
  LSP6_KEY_MANAGER_IMPLEMENTATION_ADDRESS_TESTNET,
  LSP1_UNIVERSAL_RECEIVER_ADDRESS_TESTNET,
} from '../global';

// Constants that needs to be overwritten
const MAIN_CONTROLLER_EOA = '0x3303Ce3b8644D566271DD2Eb54292d32F1458968';
const SALT = '0x5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed';

async function main() {
  // Interacting with the LSP23Factory contract
  const lsp23FactoryContract = await ethers.getContractAtFromArtifact(
    LSP23FactoryArtifact,
    LSP23_FACTORY_ADDRESS_TESTNET,
  );

  // Interacting with the UniversalProfileImplementation contract
  const universalProfileImplementationContract = await ethers.getContractAtFromArtifact(
    UniversalProfileInitArtifact,
    UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS_TESTNET,
  );

  // create the init structs of LSP23 Linked Contracts Factory
  const universalProfileInitStruct = {
    salt: SALT,
    fundingAmount: 0,
    implementationContract: UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS_TESTNET,
    initializationCalldata: universalProfileImplementationContract.interface.encodeFunctionData(
      'initialize',
      [LSP23_POST_DEPLOYMENT_MODULE_ADDRESS_TESTNET],
    ), // this will call the `initialize(...)` function of the Universal Profile and set the LSP23_POST_DEPLOYMENT_MODULE as `owner()`
  };

  const keyManagerInitStruct = {
    fundingAmount: 0,
    implementationContract: LSP6_KEY_MANAGER_IMPLEMENTATION_ADDRESS_TESTNET,
    addPrimaryContractAddress: true, // this will append the primary contract address to the init calldata
    initializationCalldata: '0xc4d66de8', // `initialize(address)` function selector
    extraInitializationParams: '0x',
  };

  //  instantiate the erc725.js class
  const erc725 = new ERC725([
    ...LSP6KeyManagerSchemas,
    ...LSP3ProfileMetadataSchemas,
    ...LSP1UniversalReceiverDelegateSchemas,
  ]);

  // create the LSP3Metadata data value
  const lsp3DataValue = {
    verification: {
      method: 'keccak256(utf8)',
      data: '0x6d6d08aafb0ee059e3e4b6b3528a5be37308a5d4f4d19657d26dd8a5ae799de0',
    },
    url: 'ipfs://QmPRoJsaYcNqQiUrQxE7ajTRaXwHyAU29tHqYNctBmK64w', // this is an example of Metadata stored on IPFS
  };

  // create the permissions data keys - value pairs to be set
  const setDataKeysAndValues = erc725.encodeData([
    { keyName: 'LSP3Profile', value: lsp3DataValue }, // LSP3Metadata data key and value
    {
      keyName: 'LSP1UniversalReceiverDelegate',
      value: LSP1_UNIVERSAL_RECEIVER_ADDRESS_TESTNET,
    }, // Universal Receiver data key and value
    {
      keyName: 'AddressPermissions:Permissions:<address>',
      dynamicKeyParts: [LSP1_UNIVERSAL_RECEIVER_ADDRESS_TESTNET],
      value: erc725.encodePermissions({
        REENTRANCY: true,
        SUPER_SETDATA: true,
      }),
    }, // Universal Receiver Delegate permissions data key and value
    {
      keyName: 'AddressPermissions:Permissions:<address>',
      dynamicKeyParts: [MAIN_CONTROLLER_EOA],
      value: erc725.encodePermissions({
        CHANGEOWNER: true,
        ADDCONTROLLER: true,
        EDITPERMISSIONS: true,
        ADDEXTENSIONS: true,
        CHANGEEXTENSIONS: true,
        ADDUNIVERSALRECEIVERDELEGATE: true,
        CHANGEUNIVERSALRECEIVERDELEGATE: true,
        REENTRANCY: false,
        SUPER_TRANSFERVALUE: true,
        TRANSFERVALUE: true,
        SUPER_CALL: true,
        CALL: true,
        SUPER_STATICCALL: true,
        STATICCALL: true,
        SUPER_DELEGATECALL: false,
        DELEGATECALL: false,
        DEPLOY: true,
        SUPER_SETDATA: true,
        SETDATA: true,
        ENCRYPT: true,
        DECRYPT: true,
        SIGN: true,
        EXECUTE_RELAY_CALL: true,
      }), // Main Controller permissions data key and value
    },
    // length of the Address Permissions array and their respective indexed keys and values
    {
      keyName: 'AddressPermissions[]',
      value: [LSP1_UNIVERSAL_RECEIVER_ADDRESS_TESTNET, MAIN_CONTROLLER_EOA],
    },
  ]);

  const abiCoder = new AbiCoder();
  const types = ['bytes32[]', 'bytes[]']; // types of the parameters

  const initializeEncodedBytes = abiCoder.encode(types, [
    setDataKeysAndValues.keys,
    setDataKeysAndValues.values,
  ]);

  // deploy the Universal Profile and its Key Manager
  const [upAddress, keyManagerAddress] = await lsp23FactoryContract.deployERC1167Proxies.staticCall(
    universalProfileInitStruct,
    keyManagerInitStruct,
    LSP23_POST_DEPLOYMENT_MODULE_ADDRESS_TESTNET,
    initializeEncodedBytes,
  );
  console.log('Universal Profile address:', upAddress);
  console.log('Key Manager address:', keyManagerAddress);

  const tx = await lsp23FactoryContract.deployERC1167Proxies(
    universalProfileInitStruct,
    keyManagerInitStruct,
    LSP23_POST_DEPLOYMENT_MODULE_ADDRESS_TESTNET,
    initializeEncodedBytes,
  );
  await tx.wait();
}

main();
