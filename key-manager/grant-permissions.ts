import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';
import LSP6Schema from '@erc725/erc725.js/schemas/LSP6KeyManager.json';
import UniversalProfileArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

const myUniversalProfileAddress = process.env.UP_ADDR || '';

const RPC_ENDPOINT = 'https://4201.rpc.thirdweb.com';
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

// Initialize erc725.js with the permission data keys from LSP6 Key Manager
const erc725 = new ERC725(
  LSP6Schema,
  myUniversalProfileAddress,
  RPC_ENDPOINT,
  {},
);

// Create the permissions for the beneficiary address
const beneficiaryPermissions = erc725.encodePermissions({
  SETDATA: true,
});

// EOA address of the new controller
const myBeneficiaryAddress = '0xcafecafecafecafecafecafecafecafecafecafe';

// Retrieve the current controllers of the Universal Profile
const addressPermissionsArray = await erc725.getData('AddressPermissions[]');
let currentControllerAddresses = null;
let currentControllerLength = 0;

if (Array.isArray(addressPermissionsArray.value)) {
  currentControllerAddresses = addressPermissionsArray.value;
  currentControllerLength = currentControllerAddresses.length;
}

// Encode the key-value pairs of the controller permission
const permissionData = erc725.encodeData([
  // the permission of the beneficiary address
  {
    keyName: 'AddressPermissions:Permissions:<address>',
    dynamicKeyParts: myBeneficiaryAddress,
    value: beneficiaryPermissions,
  },
  // The new incremented list of permissioned controllers addresses
  {
    keyName: 'AddressPermissions[]',
    value: [myBeneficiaryAddress],
    startingIndex: currentControllerLength,
    totalArrayLength: currentControllerLength + 1,
  },
]);

// Private key to sign the transaction
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';

// Existing UP controller
const controller = new ethers.Wallet(PRIVATE_KEY).connect(provider);

// instantiate the Universal Profile
const myUniversalProfile = new ethers.Contract(
  myUniversalProfileAddress,
  UniversalProfileArtifact.abi,
);

try {
  // Execute the transaction
  await myUniversalProfile
    .connect(controller)
    // @ts-expect-error Ethers BaseContract does not pick dynamic types from ABIs
    .setData(permissionData.keys, permissionData.values);

  const updatedPermissions = await erc725.getData({
    keyName: 'AddressPermissions:Permissions:<address>',
    dynamicKeyParts: myBeneficiaryAddress,
  });

  if (updatedPermissions && typeof updatedPermissions.value === 'string') {
    console.log(
      `The beneficiary address ${myBeneficiaryAddress} has the following permissions:`,
      erc725.decodePermissions(updatedPermissions.value),
    );
  } else {
    console.error(
      `No permissions for beneficiary address ${myBeneficiaryAddress} found`,
    );
  }
} catch (error) {
  console.error('Could not execute the controller update:', error);
}
