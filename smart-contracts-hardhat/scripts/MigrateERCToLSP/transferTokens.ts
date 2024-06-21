import { ethers, parseUnits } from 'ethers';
import { config as LoadEnv } from 'dotenv';
import LSP7Artifact from '@lukso/lsp7-contracts/artifacts/LSP7Mintable.json';

LoadEnv();

const TOKEN_ADDRESS = '0xdb6B269e77634CD13A4F738C66aAF466344B4348';

const provider = new ethers.JsonRpcProvider('https://rpc.testnet.lukso.network');

const SIGNER = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const tokenContract = new ethers.Contract(TOKEN_ADDRESS, LSP7Artifact.abi, SIGNER);

const tokenRecipient = '0xcafecafecafecafecafecafecafecafecafecafe';
const amount = ethers.parseUnits('10', 'ether');

async function checkBalance() {
  const balance = await tokenContract.balanceOf(SIGNER.address);
  console.log('balance of ' + SIGNER.address + ' : ' + balance);
}
// checkBalance();

async function transferTokensAsHolder() {
  try {
    const tx = await tokenContract
      .connect(SIGNER)
      .transfer(SIGNER.address, tokenRecipient, amount, true, '0x');

    const receipt = await tx.wait();
    console.log('sending tokens as holder');
    console.log('tx hash: ', receipt.hash);
  } catch (error: any) {
    const errorDescription = tokenContract.interface.getError(error.data.slice(0, 10));
    console.log('errorDescription: ', errorDescription);

    const errorName = errorDescription?.name;
    console.log('name of custom error: ', errorName);

    const decodedError = tokenContract.interface.decodeErrorResult(errorDescription, error.data);
    console.log('decoded error parameters: ', decodedError);
  }
}
// transferTokensAsHolder();

async function transferAsOperator() {
  const OPERATOR = new ethers.Wallet(process.env.OPERATOR_PRIVATE_KEY as string, provider);
  // console.log(OPERATOR);

  const allowance = ethers.parseUnits('5', 'ether');

  // 1. authorize as an operator
  const tx = await tokenContract
    .connect(SIGNER)
    .authorizeOperator(OPERATOR.address, allowance, '0x');
  await tx.wait();

  const operatorAllowance = await tokenContract.authorizedAmountFor(
    OPERATOR.address,
    SIGNER.address,
  );
  console.log('operator allowance: ', operatorAllowance);

  const transferTransaction = await tokenContract
    .connect(OPERATOR)
    .transfer(SIGNER.address, tokenRecipient, parseUnits('2', 'ether'), true, '0x');

  const receipt = await transferTransaction.wait();
  console.log('transferring tokens as an operator...');
  console.log('tx hash: ', receipt.hash);
}
transferAsOperator();
