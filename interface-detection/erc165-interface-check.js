// Imports
import { ethers } from 'ethers';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts/dist/constants.cjs.js';

// Connect to the LUKSO Testnet
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.network';
const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);

// Create an instance of the Universal Profile
const contractAddress = '0x9139def55c73c12bcda9c44f12326686e3948634';
const myUPContract = new ethers.Contract(
  contractAddress,
  UniversalProfile.abi,
  provider,
);

const LSP0_INTERFACE_ID = INTERFACE_IDS.LSP0ERC725Account;

/*
Supported interfaces from lsp-smart-contracts library:

INTERFACE_IDS.ERC165                        INTERFACE_IDS.ERC20
INTERFACE_IDS.ERC223                        INTERFACE_IDS.ERC721
INTERFACE_IDS.ERC721Metadata                INTERFACE_IDS.ERC725X
INTERFACE_IDS.ERC725Y                       INTERFACE_IDS.ERC777
INTERFACE_IDS.ERC1155         

INTERFACE_IDS.LSP0ERC725Account             INTERFACE_IDS.LSP1UniversalReceiver
INTERFACE_IDS.LSP6KeyManager                INTERFACE_IDS.LSP7DigitalAsset
INTERFACE_IDS.LSP8IdentifiableDigitalAsset  INTERFACE_IDS.LSP9Vault
INTERFACE_IDS.LSP11BasicSocialRecovery      INTERFACE_IDS.LSP14Ownable2Step
INTERFACE_IDS.LSP17Extendable               INTERFACE_IDS.LSP17Extension
INTERFACE_IDS.LSP20CallVerification         INTERFACE_IDS.LSP20CallVerifier
INTERFACE_IDS.LSP25ExecuteRelayCall 
*/

(async () => {
  try {
    const supportsInterface =
      await myUPContract.supportsInterface(LSP0_INTERFACE_ID);
    console.log(supportsInterface); // true or false
  } catch (error) {
    console.error('Error:', error);
  }
})();
