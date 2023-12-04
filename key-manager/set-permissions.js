// Imports
import { ethers } from 'ethers';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import KeyManager from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json';
import { ADDRESSES, PERMISSIONS, PERMISSIONS_ARRAY } from './constants';

// Connect to the LUKSO Testnet
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

const myUniversalProfileAddress = '0x...';
const myKeyManagerAddress = '0x...';

const walletPrivateKey = '<your-wallet-private-key>'; // Replace with your wallet's private key
const wallet = new ethers.Wallet(walletPrivateKey, provider);

const universalProfile = new ethers.Contract(
  myUniversalProfileAddress,
  UniversalProfile.abi,
  wallet,
);

// EOA address of an exemplary person
let bobAddress = '0x...';
let bobPermissions = PERMISSIONS.SETDATA;

// give the permission SETDATA to Bob
async function setPermission() {
  try {
    const permissionData = [
      ADDRESSES.PERMISSIONS + bobAddress.substring(2), // allow Bob to setData on your UP
      PERMISSIONS_ARRAY, // length of AddressPermissions[]
      PERMISSIONS_ARRAY.slice(0, 34) + '00000000000000000000000000000001', // add Bob's address into the list of permissions
    ];

    const permissionParams = [
      bobPermissions,
      3, // 3 because UP owner + Universal Receiver Delegate permission have already been set by lsp-factory
      bobAddress,
    ];

    const tx = await universalProfile.populateTransaction[
      'setData(bytes32[],bytes[])'
    ](permissionData, permissionParams);

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
