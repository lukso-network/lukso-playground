import { ethers } from 'ethers';
import {
  PERMISSIONS,
  ERC725YDataKeys,
} from '@lukso/lsp-smart-contracts/constants';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';

// Connect to the LUKSO Testnet
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

const myUniversalProfileAddress = '0x9fc7e5095A054dfA3c6b237E0e5d686638394248';
const myKeyManagerAddress = '0x87fa9105cA247897Acb4F12Ddf6EC3CEF23F6059';

const walletPrivateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Replace with your wallet's private key
const wallet = new ethers.Wallet(walletPrivateKey, provider);

const universalProfile = new ethers.Contract(
  myUniversalProfileAddress,
  UniversalProfile.abi,
  wallet,
);

// EOA address of an exemplary person
const bobAddress = '0xcafecafecafecafecafecafecafecafecafecafe';
const bobPermissions = PERMISSIONS.SETDATA;

// give the permission SETDATA to Bob
async function setPermission() {
  try {
    const permissionData = [
      ERC725YDataKeys.LSP6['AddressPermissions:Permissions'] +
        bobAddress.substring(2), // allow Bob to setData on your UP
      ERC725YDataKeys.LSP6['AddressPermissions[]'].length, // length of AddressPermissions[]
      ERC725YDataKeys.LSP6['AddressPermissions[]'].index +
        '00000000000000000000000000000001', // add Bob's address into the list of permissions
    ];

    const permissionParams = [
      bobPermissions,
      3, // 3 because UP owner + Universal Receiver Delegate permission have already been set on profile creation
      bobAddress,
    ];

    const tx = await universalProfile.setDataBatch.populateTransaction(
      permissionData,
      permissionParams,
    );

    const txResponse = await wallet.sendTransaction({
      to: myKeyManagerAddress,
      data: tx.data,
      gasLimit: 300000,
    });

    await txResponse.wait();
    console.log('Permission set successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

setPermission();
