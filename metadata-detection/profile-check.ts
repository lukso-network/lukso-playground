import { ERC725 } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';

// 💡 Note: You can debug any smart contract by using the ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/inspector?address=0x9139def55c73c12bcda9c44f12326686e3948634&network=testnet

const profileContractAddress = '0x9139def55c73c12bcda9c44f12326686e3948634';

// Initatiate erc725.js
const erc725js = new ERC725(
  lsp3ProfileSchema,
  profileContractAddress,
  'https://4201.rpc.thirdweb.com',
  {},
);

// Verify if the standard is supported (value !== null)
// 📚 https://docs.lukso.tech/standards/universal-profile/lsp3-profile-metadata/#supportedstandardslsp3profile
const data = await erc725js.getData('SupportedStandards:LSP3Profile');
const isLSP3 = data.value !== null;

if (isLSP3) {
  console.log(
    `✅ The contract: ${profileContractAddress} supports the LSP3Profile standard`,
  );
} else {
  console.log(
    `❌ The address: ${profileContractAddress} does not supports the LSP3Profile standard`,
  );
}
