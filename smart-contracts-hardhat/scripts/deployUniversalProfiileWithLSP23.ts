// libs
import { ethers } from 'hardhat';
import { AbiCoder } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';

// LSPs artifacts
import LSP23FactoryArtifact from '@lukso/lsp-smart-contracts/artifacts/LSP23LinkedContractsFactory.json';
import UniversalProfileInitArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfileInit.json';

// ERC725.js schemas
import LSP1UniversalReceiverDelegateSchemas from '@erc725/erc725.js/schemas/LSP1UniversalReceiverDelegate.json';
import LSP3ProfileMetadataSchemas from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import LSP6KeyManagerSchemas from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

const LSP23_FACTORY_ADDRESS = '0x2300000A84D25dF63081feAa37ba6b62C4c89a30';
const LSP23_POST_DEPLOYMENT_MODULE = '0x000000000066093407b6704B89793beFfD0D8F00';
const UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS = '0x3024D38EA2434BA6635003Dc1BDC0daB5882ED4F';
const LSP6_KEY_MANAGER_IMPLEMENTATION_ADDRESS = '0x2Fe3AeD98684E7351aD2D408A43cE09a738BF8a4';
const UNIVERSAL_RECEIVER_ADDRESS = '0x7870C5B8BC9572A8001C3f96f7ff59961B23500D'; // this will be needed later so we can set the Universal Receiver to the Universal Profile (see https://docs.lukso.tech/standards/generic-standards/lsp1-universal-receiver)
const MAIN_CONTROLLER = '0x3303Ce3b8644D566271DD2Eb54292d32F1458968';
const SALT = '0x5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed5eed';

async function main() {
  // Interacting with the LSP23Factory contract
  const lsp23FactoryContract = await ethers.getContractAtFromArtifact(
    LSP23FactoryArtifact,
    LSP23_FACTORY_ADDRESS,
  );

  // Interacting with the UniversalProfileImplementation contract
  const universalProfileImplementationContract = await ethers.getContractAtFromArtifact(
    UniversalProfileInitArtifact,
    UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS,
  );

  // create the init structs
  const universalProfileInitStruct = {
    salt: SALT,
    fundingAmount: 0,
    implementationContract: UNIVERSAL_PROFILE_IMPLEMENTATION_ADDRESS,
    initializationCalldata: universalProfileImplementationContract.interface.encodeFunctionData(
      'initialize',
      [LSP23_POST_DEPLOYMENT_MODULE],
    ), // this will call the `initialize(...)` function of the Universal Profile and the the LSP23_POST_DEPLOYMENT_MODULE as owner
  };

  const keyManagerInitStruct = {
    fundingAmount: 0,
    implementationContract: LSP6_KEY_MANAGER_IMPLEMENTATION_ADDRESS,
    addPrimaryContractAddress: true, // this will append the primary contract address to the init calldata
    initializationCalldata: '0xc4d66de8', // `initialize(...)` function selector
    extraInitializationParams: '0x',
  };

  // instantiate the erc725 class
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
    url: 'ipfs://QmPRoJsaYcNqQiUrQxE7ajTRaXwHyAU29tHqYNctBmK64w',
  };

  // create the permissions data keys
  const setDataKeysAndValues = erc725.encodeData([
    { keyName: 'LSP3Profile', value: lsp3DataValue }, // LSP3Metadata data key and value
    {
      keyName: 'LSP1UniversalReceiverDelegate',
      value: UNIVERSAL_RECEIVER_ADDRESS,
    }, // Universal Receiver data key and value
    {
      keyName: 'AddressPermissions:Permissions:<address>',
      dynamicKeyParts: [UNIVERSAL_RECEIVER_ADDRESS],
      value: erc725.encodePermissions({
        REENTRANCY: true,
        SUPER_SETDATA: true,
      }),
    }, // Universal Receiver Delegate permissions data key and value
    {
      keyName: 'AddressPermissions:Permissions:<address>',
      dynamicKeyParts: [MAIN_CONTROLLER],
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
      value: [UNIVERSAL_RECEIVER_ADDRESS, MAIN_CONTROLLER],
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
    LSP23_POST_DEPLOYMENT_MODULE,
    initializeEncodedBytes,
  );
  console.log('Universal Profile address:', upAddress);
  console.log('Key Manager address:', keyManagerAddress);

  const tx = await lsp23FactoryContract.deployERC1167Proxies(
    universalProfileInitStruct,
    keyManagerInitStruct,
    LSP23_POST_DEPLOYMENT_MODULE,
    initializeEncodedBytes,
  );
  await tx.wait();
}

main();
