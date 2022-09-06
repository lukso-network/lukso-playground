// see file above constants.js
const { ADDRESSES, PERMISSIONS, PERMISSIONS_ARRAY } = require("./constants");

const UniversalProfile = require("@lukso/lsp-smart-contracts/build/artifacts/UniversalProfile.json");
const KeyManager = require("@lukso/lsp-smart-contracts/build/artifacts/KeyManager.json");

const myUniversalProfileAddress = "0x...";
const myKeyManagerAddress = "0x...";

const universalProfile = new web3.eth.Contract(
  UniversalProfile.abi,
  myUniversalProfileAddress
);
const keyManager = new web3.eth.Contract(KeyManager.abi, myKeyManagerAddress);

// EOA address of an exemplary person
let bobAddress = "0x...";
let bobPermissions = PERMISSIONS.SETDATA;

// give the permission SETDATA to Bob
async function setPermission() {
  let payload = await universalProfile.methods["setData(bytes32[],bytes[])"](
    [
      ADDRESSES.PERMISSIONS + bobAddress.substr(2), // allow Bob to setData on your UP
      PERMISSIONS_ARRAY, // length of AddressPermissions[]
      PERMISSIONS_ARRAY.slice(0, 34) + "00000000000000000000000000000001", // add Bob's address into the list of permissions
    ],
    [
      bobPermissions,
      3, // 3 because UP owner + Universal Receiver Delegate permission have already been set by lsp-factory
      bobAddress,
    ]
  ).encodeABI();

  keyManager.execute(payload).send({
    // Connected wallet with EOA address that is set to control the UP
    from: "<my-wallet-address>",
    gasLimit: 300_000,
  });
}

setPermission();
