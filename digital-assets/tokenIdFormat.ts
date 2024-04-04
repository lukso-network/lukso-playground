import { ethers } from 'ethers';
import lsp8Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

const SAMPLE_LSP8_ASSET = '0x8734600968c7e7193BB9B1b005677B4edBaDcD18';
const RPC_URL = 'https://4201.rpc.thirdweb.com';

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create contract instance
const myAssetContract = new ethers.Contract(
  SAMPLE_LSP8_ASSET,
  lsp8Artifact.abi,
  provider,
);

// Sample Token ID of the contract
// Could be 1, my-token-id, 0x123, etc.
const myTokenId = '1';

// https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md#lsp8tokenidformat
async function getTokenIdFormat() {
  try {
    const tokenIdFormat = parseInt(
      // https://docs.lukso.tech/tools/erc725js/classes/ERC725#getdata
      await myAssetContract.getData(ERC725YDataKeys.LSP8['LSP8TokenIdFormat']),
      16,
    );
    return tokenIdFormat;
  } catch (err) {
    console.error(
      'Could not retrieve LSP8TokenIdFormat. Please provide an LSP8 asset address.',
    );
    return null;
  }
}

// Get the  global token ID format of the asset
let tokenIdFormat = await getTokenIdFormat();
console.log('Global ID Format: ', tokenIdFormat);

// Convert a token ID according to LSP8TokenIdFormat
// https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md#lsp8tokenidformat
const convertTokenId = (tokenID: string, tokenIdFormat: number) => {
  switch (tokenIdFormat) {
    // TokenID is Number
    case 0:
    case 100:
      // uint256 - Number (Left padded)
      return ethers.zeroPadValue('0x0' + BigInt(tokenID).toString(16), 32);
    // TokenID is String
    case 1:
    case 101:
      // string - String (Right padded)
      return ethers.encodeBytes32String(tokenID).padEnd(32, '0');
    // TokenID is Address
    case 2:
    case 102:
      // address - Smart Contract (Left padded)
      return ethers.zeroPadValue(tokenID, 32);
    // TokenID is Byte Value
    case 3:
    case 103:
      // bytes32 - Unique Bytes (Right padded)
      return ethers
        .hexlify(ethers.getBytes(tokenID).slice(0, 32))
        .padEnd(66, '0');
    // TokenID is Hash Digest
    case 4:
    case 104:
      // bytes32 - Hash Digest (No padding)
      return tokenID;
  }
};

// Convert the token ID based on the token ID format
if (tokenIdFormat !== null) {
  let byte32TokenId = convertTokenId(myTokenId, tokenIdFormat);
  console.log('Parsed Byte32 Token ID: ', byte32TokenId);

  // If token ID format is mixed
  if (tokenIdFormat >= 100) {
    tokenIdFormat = parseInt(
      // Retrieve token ID format for the individual token ID
      // https://docs.lukso.tech/contracts/contracts/LSP8IdentifiableDigitalAsset/#getdatafortokenid
      await myAssetContract.getDataForTokenId(
        byte32TokenId,
        ERC725YDataKeys.LSP8['LSP8TokenIdFormat'],
      ),
      16,
    );
    // Convert the token ID based on the individual token ID format
    byte32TokenId = convertTokenId(myTokenId, tokenIdFormat);
    console.log('Individual Token ID Format: ', tokenIdFormat);
  } else {
    console.log('Asset has a global Token ID Format');
  }
}
