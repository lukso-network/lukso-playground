import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';
import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts';

// 📚 https://docs.lukso.tech/contracts/interface-ids
// 📚 https://docs.lukso.tech/learn/dapp-developer/standard-detection

// 💡 Note: You can debug any smart contract by using the ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/inspector?address=0x61b083f1fb63ba2F064990f01B233B547ED4F5Cb&network=mainnet
const SAMPLE_ASSET_CONTRACT_ADDRESS = '0x61b083f1fb63ba2F064990f01B233B547ED4F5Cb';

// https://docs.lukso.tech/networks/mainnet/parameters
const RPC_URL = 'https://rpc.lukso.gateway.fm';

const myAsset = new ERC725(lsp4Schema, SAMPLE_ASSET_CONTRACT_ADDRESS, RPC_URL, {
  ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
});

const isLSP7 = await myAsset.supportsInterface(INTERFACE_IDS.LSP7DigitalAsset);

const isLSP8 = await myAsset.supportsInterface(INTERFACE_IDS.LSP8IdentifiableDigitalAsset);

if (isLSP7) {
  console.log(`✅ The contract: ${SAMPLE_ASSET_CONTRACT_ADDRESS} supports the LSP7 interface ID`);
}
if (isLSP8) {
  console.log(`✅ The contract: ${SAMPLE_ASSET_CONTRACT_ADDRESS} supports the LSP8 interface ID`);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

// 💡 Note: You can debug any smart contract by using the ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/inspector?address=0xe65e927d0eccaaab6972170b489d3c1455955116&network=mainnet
const universalProfileContractAddress = '0xe65e927d0eccaaab6972170b489d3c1455955116';

// Create an instance of the Universal Profile
const myProfileContract = new ethers.Contract(
  universalProfileContractAddress,
  UniversalProfile.abi,
  provider,
);

const isLSP0 = await myProfileContract.supportsInterface(INTERFACE_IDS.LSP0ERC725Account);

if (isLSP0) {
  console.log(
    `✅ The contract: ${universalProfileContractAddress} supports the LSP0ERC725Account interface ID`,
  );
} else {
  console.log(
    `❌ The address: ${universalProfileContractAddress} does not supports the LSP0ERC725Account interface ID`,
  );
}

/*
Supported interfaces from lsp-smart-contracts library:
https://docs.lukso.tech/tools/lsp-smart-contracts/constants
*/
