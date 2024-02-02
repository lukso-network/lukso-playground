import { ERC725 } from '@erc725/erc725.js';
import LSP6Schema from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

const myUniversalProfileAddress = '0xEda145b45f76EDB44F112B0d46654044E7B8F319';

// 💡 Note: You can debug any smart contract by using the ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/inspector?address=0xEda145b45f76EDB44F112B0d46654044E7B8F319&network=testnet

// https://docs.lukso.tech/networks/testnet/parameters
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';

const erc725 = new ERC725(LSP6Schema, myUniversalProfileAddress, RPC_ENDPOINT);

// 💡 You can debug permissions from ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/key-manager

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
