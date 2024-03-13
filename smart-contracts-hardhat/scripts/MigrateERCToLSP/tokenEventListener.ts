import { EventFragment, ethers } from 'ethers';
import LSP7Artifact from '@lukso/lsp7-contracts/artifacts/LSP7Mintable.json';
import { config as LoadEnv } from 'dotenv';

LoadEnv();

const TOKEN_ADDRESS = '0xCDd467E16034C2B55aFCe97a9B38B201487c5934';

const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');
const SIGNER = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const tokenContract = new ethers.Contract(TOKEN_ADDRESS, LSP7Artifact.abi, SIGNER);

// listening for minted tokens
// async function listenForMintedTokens(event: EventFragment) {
//   console.log(event);
// }

console.log('started listening for transfer events... 🦻🏻');
tokenContract.on('Transfer', (event) => {
  console.log(event.eventName, event.args, event.log);
});
// listening for tokens transferred from a specific address

// listening for tokens transferred from an operator
