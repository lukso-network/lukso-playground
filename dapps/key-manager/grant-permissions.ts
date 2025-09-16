import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';
import LSP6Schema from '@erc725/erc725.js/schemas/LSP6KeyManager.json';
import UniversalProfileArtifact from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

const myUniversalProfileAddress = process.env.UP_ADDR || '';
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';

// Initialize erc725.js with the schemas of the permission data keys from LSP6 Key Manager
const erc725 = new ERC725(LSP6Schema, myUniversalProfileAddress, RPC_ENDPOINT);

// Create the raw permissions value to allow an address
// to set any data keys (except LSP17 extensions and LSP1 Universal Receiver Delegates)
// on our Universal Profile
const permissionSetAnyDataKey = erc725.encodePermissions({
  SUPER_SETDATA: true,
});

// address to give permissions to (can be an EOA or a smart contract)
const newControllerAddress = '0xcafecafecafecafecafecafecafecafecafecafe';

// Retrieve the list of addresses that have permissions on the Universal Profile (= controllers)
const addressPermissionsArrayValue = await erc725.getData(
  'AddressPermissions[]',
);
let numberOfControllers = 0;

if (Array.isArray(addressPermissionsArrayValue.value)) {
  numberOfControllers = addressPermissionsArrayValue.value.length;
}

// Encode the set of key-value pairs to set a new controller with permissions on the Universal Profile
const permissionData = erc725.encodeData([
  // this sets the permission `SUPER_SETDATA` to the new controller address
  {
    keyName: 'AddressPermissions:Permissions:<address>',
    dynamicKeyParts: newControllerAddress,
    value: permissionSetAnyDataKey,
  },
  // The `AddressPermissions[]` array contains the list of permissioned addresses (= controllers)
  // This adds the `newControllerAddress` in this list at the end (at the last index) and increment the array length.
  {
    keyName: 'AddressPermissions[]',
    value: [newControllerAddress],
    startingIndex: numberOfControllers,
    totalArrayLength: numberOfControllers + 1,
  },
]);

// Connect the UP Browser Extension and retrieve our UP Address
const provider = new ethers.BrowserProvider(window.lukso);
const accounts = await provider.send('eth_requestAccounts', []);

// Create an instance of the UniversalProfile contract
const myUniversalProfile = new ethers.Contract(
  accounts[0],
  UniversalProfileArtifact.abi,
);

try {
  // Send the transaction
  await myUniversalProfile
    .connect(accounts[0])
    // @ts-expect-error Ethers BaseContract does not pick dynamic types from ABIs
    .setData(permissionData.keys, permissionData.values);

  const updatedPermissions = await erc725.getData({
    keyName: 'AddressPermissions:Permissions:<address>',
    dynamicKeyParts: newControllerAddress,
  });

  if (updatedPermissions && typeof updatedPermissions.value === 'string') {
    console.log(
      `✅ Successfully added the following permissions to address ${newControllerAddress}:`,
      erc725.decodePermissions(updatedPermissions.value),
    );
  } else {
    console.error(
      `No permissions for beneficiary address ${newControllerAddress} found`,
    );
  }
} catch (error) {
  console.error(
    `Could not execute transaction to add permissions to address ${newControllerAddress}. Error:`,
    error,
  );
}
