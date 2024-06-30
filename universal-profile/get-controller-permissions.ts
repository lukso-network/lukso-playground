import { ERC725 } from '@erc725/erc725.js';
import LSP6Schema from '@erc725/erc725.js/schemas/LSP6KeyManager.json';

// 💡 Note: You can debug any smart contract by using the ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/inspector?address=0xEda145b45f76EDB44F112B0d46654044E7B8F319&network=testnet

// Instantiate erc725.js with a Universal Profile address on Testnet
const erc725 = new ERC725(
  LSP6Schema,
  // Sample Profile Address
  '0xEda145b45f76EDB44F112B0d46654044E7B8F319',
  // LUKSO Testnet RPC
  'https://4201.rpc.thirdweb.com',
);

// 💡 You can debug permissions from ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/key-manager

async function getPermissionedAddresses() {
  // Get the list of addresses that have permissions on the Universal Profile
  // https://docs.lukso.tech/standards/universal-profile/lsp6-key-manager/#permissions
  // https://docs.lukso.tech/tools/erc725js/classes/ERC725#getdata
  const controllerAddresses = await erc725.getData('AddressPermissions[]');

  if (!controllerAddresses) {
    console.error('No controllers listed under this Universal Profile ');
  }

  if (Array.isArray(controllerAddresses.value)) {
    // Get the permissions of each controller of the UP
    for (let i = 0; i < controllerAddresses.value.length; i++) {
      const address = controllerAddresses.value[i] as string;

      // https://docs.lukso.tech/tools/erc725js/classes/ERC725#getdata
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
