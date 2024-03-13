import {
  JsonRpcProvider,
  Wallet,
  Contract,
  toUtf8String,
  toUtf8Bytes,
} from 'ethers';
import { config as LoadEnv } from 'dotenv';
import LSP7Artifact from '@lukso/lsp7-contracts/artifacts/LSP7Mintable.json';

LoadEnv();

const provider = new JsonRpcProvider('https://rpc.testnet.lukso.gateway.fm');

// constants
import { LSP4DataKeys } from '@lukso/lsp4-contracts';
import { LSP8DataKeys } from '@lukso/lsp8-contracts';
const TOKEN_ADDRESS = '0xCDd467E16034C2B55aFCe97a9B38B201487c5934';

const SIGNER = new Wallet(process.env.PRIVATE_KEY as string, provider);

const tokenContract = new Contract(TOKEN_ADDRESS, LSP7Artifact.abi, SIGNER);

async function readTokenData() {
  // get token name
  const tokenNameBytes = await tokenContract.getData(
    LSP4DataKeys.LSP4TokenName,
  );
  console.log('token name: ', toUtf8String(tokenNameBytes));

  // get token symbol
  const tokenSymbolBytes = await tokenContract.getData(
    LSP4DataKeys.LSP4TokenSymbol,
  );
  console.log('token symbol: ', toUtf8String(tokenSymbolBytes));
}
readTokenData();

async function setTokenData() {
  const BASE_URI = 'https://my-base-uri.com/nft/';
  // set LSP8 Metadata Base URI
  const tx = await tokenContract.setData(
    LSP8DataKeys.LSP8TokenMetadataBaseURI,
    toUtf8Bytes(BASE_URI),
  );
  const txReceipt = await tx.wait();

  console.log('setting base URI to: ', BASE_URI);
  console.log('tx hash: ', txReceipt.hash);

  // we can also use `setDataBatch` to set multiple data keys at once
  const VERIFIABLE_URI_SAMPLE_VALUE =
    '0x00006f357c6a0020bfcbe4aa68c4293c1256308f4a6df015ae2a31aca19764fe1e6de6d13f5ecc8d697066733a2f2f516d55726e4437324d3877446d48416147766b6136645247684337354c376f357162537457644744595457353178';

  const batchTx = await tokenContract.setDataBatch(
    [
      LSP4DataKeys['LSP4Creators[]'].length,
      LSP4DataKeys['LSP4Creators[]'].index + '00000000000000000000000000000000',
      LSP4DataKeys.LSP4Metadata,
    ],
    [
      '0x00000000000000000000000000000001',
      SIGNER.address,
      VERIFIABLE_URI_SAMPLE_VALUE,
    ],
  );
  const batchTxReceipt = await batchTx.wait();

  console.log('setting LSP4 Creator and Asset metadata...');
  console.log('tx hash: ', batchTxReceipt.hash);
}
setTokenData();
