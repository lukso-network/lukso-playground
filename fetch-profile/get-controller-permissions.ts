import { ERC725 } from '@erc725/erc725.js';
import LSP6Schema from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

// Setup with sample address and testnet RPC
const myUniversalProfileAddress = '0xC26508178c4D7d3Ad43Dcb9F9bb1fab9ceeD58B5';
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';

const erc725 = new ERC725(LSP6Schema, myUniversalProfileAddress, RPC_ENDPOINT);

async function getPermissionedAddresses() {
  // Get the list of addresses that have permissions on the Universal Profile
  const result = await erc725.getData('AddressPermissions[]');

  if (!result) {
    console.error(
      'No controllers listed under UP at address ',
      myUniversalProfileAddress,
    );
  }

  if (Array.isArray(result.value)) {
    // Get the permissions of each address
    for (let ii = 0; ii < result.value.length; ii++) {
      const address = result.value[ii] as string;

      const addressPermission = await erc725.getData({
        keyName: 'AddressPermissions:Permissions:<address>',
        dynamicKeyParts: address,
      });

      // Decode the permission of each address
      const decodedPermission = erc725.decodePermissions(
        addressPermission.value as string,
      );

      // Display the permission in a readable format
      console.log(
        `decoded permission for ${address} = ` +
          JSON.stringify(decodedPermission, null, 2),
      );
    }
  }
}

getPermissionedAddresses();
