// Regular transaction execution using the browser extension
import Web3 from 'web3';

const web3 = new Web3(window.ethereum);

await web3.eth.requestAccounts();
const accounts = await web3.eth.getAccounts();

await web3.eth.sendTransaction({
  from: accounts[0], // The Universal Profile address
  to: '0x...', // receiving address, can be a UP or EOA
  value: '5000000000000000000', // 0.5 amount in LYX, in wei unit
});
