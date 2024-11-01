import { ERC725 } from '@erc725/erc725.js';

// This contains the schemas of the data keys:
// - AddressPermissions[] -> list of controllers
// - `AddressPermission:Permissions:<controller-address> -> permission of a specific controller
import LSP6Schema from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

// Sample Profile Address
const UNIVERSAL_PROFILE = '0xEda145b45f76EDB44F112B0d46654044E7B8F319';

// Instantiate erc725.js with a Universal Profile address on Testnet
const erc725 = new ERC725(
  LSP6Schema,
  UNIVERSAL_PROFILE,
  'https://rpc.testnet.lukso.network',
);

// Get the list of addresses that have permissions on the Universal Profile
const controllerAddresses = await erc725.getData('AddressPermissions[]');

if (!controllerAddresses) {
  console.log('No controllers listed under this Universal Profile ');
} else {
  console.log(controllerAddresses);
  // {
  //   key: '0xdf30dba06db6a30e65354d9a64c609861f089545ca58c6b4dbe31a5f338cb0e3',
  //   name: 'AddressPermissions[]',
  //    value: [
  //      '0x5F606b5b237623463a90F63230F9b929321dbCBa',
  //      '0xa1061408e55c971fD129eF5561dFB953d598dAD7'
  //    ]
  // }

  if (Array.isArray(controllerAddresses.value)) {
    // Get the permissions of each controller of the UP
    for (let i = 0; i < controllerAddresses.value.length; i++) {
      const address = controllerAddresses.value[i] as string;

      const permissionsValue = await erc725.getData({
        keyName: 'AddressPermissions:Permissions:<address>',
        dynamicKeyParts: address,
      });

      console.log(permissionsValue);
      // {
      //   key: '0x4b80742de2bf82acb3630000a1061408e55c971fd129ef5561dfb953d598dad7',
      //   name: 'AddressPermissions:Permissions:a1061408e55c971fD129eF5561dFB953d598dAD7',
      //   value: '0x0000000000000000000000000000000000000000000000000000000000000008'
      // }

      // Decode the permission of each address
      const decodedPermissions = erc725.decodePermissions(
        permissionsValue.value as string,
      );

      // Display the permission in a readable format
      console.log(
        `Decoded permission for ${address} = ` +
          JSON.stringify(decodedPermissions, null, 2),
      );
      // Decoded permission for 0x5F606b5b237623463a90F63230F9b929321dbCBa = {
      //   "CHANGEOWNER": true,
      //   "ADDCONTROLLER": true,
      //   "EDITPERMISSIONS": true,
      //   "ADDEXTENSIONS": true,
      //   "CHANGEEXTENSIONS": true,
      //   "ADDUNIVERSALRECEIVERDELEGATE": true,
      //   "CHANGEUNIVERSALRECEIVERDELEGATE": true,
      //   "REENTRANCY": false,
      //   "SUPER_TRANSFERVALUE": true,
      //   "TRANSFERVALUE": true,
      //   "SUPER_CALL": true,
      //   "CALL": true,
      //   "SUPER_STATICCALL": true,
      //   "STATICCALL": true,
      //   "SUPER_DELEGATECALL": false,
      //   "DELEGATECALL": false,
      //   "DEPLOY": true,
      //   "SUPER_SETDATA": true,
      //   "SETDATA": true,
      //   "ENCRYPT": true,
      //   "DECRYPT": true,
      //   "SIGN": true,
      // }
    }
  }
}
