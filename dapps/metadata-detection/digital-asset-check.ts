import { ERC725 } from '@erc725/erc725.js';
import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

// 💡 Note: You can debug any smart contract by using the ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/inspector?address=0x86e817172b5c07f7036bf8aa46e2db9063743a83&network=mainnet
const assetContractAddress = '0xbA712C92C6e10f22d7C737f9BC7dAa22B65548F7';

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp4Schema,
  assetContractAddress,
  'https://rpc.testnet.lukso.network',
  {},
);

// Verify if the standard is supported (value !== null)
// 📚 https://docs.lukso.tech/standards/tokens/LSP4-Digital-Asset-Metadata#supportedstandardslsp4digitalasset
const data = await erc725js.getData('SupportedStandards:LSP4DigitalAsset');
const isLSP4 = data.value !== null;

if (isLSP4) {
  console.log(
    `✅ The contract: ${assetContractAddress} supports the LSP4DigitalAsset standard`,
  );
} else {
  console.log(
    `❌ The address: ${assetContractAddress} does not supports the LSP4DigitalAsset standard`,
  );
}
