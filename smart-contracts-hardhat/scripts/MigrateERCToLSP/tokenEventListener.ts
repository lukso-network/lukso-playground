import { EventFragment, ethers } from 'ethers';
import LSP7Artifact from '@lukso/lsp7-contracts/artifacts/LSP7Mintable.json';
import { config as LoadEnv } from 'dotenv';

LoadEnv();

const TOKEN_ADDRESS = '0xCDd467E16034C2B55aFCe97a9B38B201487c5934';

const provider = new ethers.WebSocketProvider('wss://ws-rpc.testnet.lukso.network');
const SIGNER = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const tokenContract = new ethers.Contract(TOKEN_ADDRESS, LSP7Artifact.abi, provider);

// listening for minted tokens
// async function listenForMintedTokens(event: EventFragment) {
//   console.log(event);
// }

async function listenForEvent() {
  console.log('started listening for transfer events... 🦻🏻');
  await tokenContract.on('Transfer', async (operator, from, to, amount, force, data) => {
    console.log('operator: ', operator);
    console.log('from: ', from);
    console.log('to: ', to);
    console.log('amount: ', amount);
    console.log('force: ', force);
    console.log('data: ', data);
  });
}
// listenForEvent();

// listening for tokens transferred from a specific address
async function listenForTransferFromSender() {
  const result = tokenContract.filters.Transfer(null, SIGNER.address);
  console.log('transfers from signer: ', result.fragment.inputs);
}
listenForTransferFromSender();

// listening for tokens transferred from an operator
