import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';

import lsp8Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import lsp8Schema from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json';
import { INTERFACE_IDS, ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

const provider = new ethers.JsonRpcProvider(
  'https://rpc.testnet.lukso.gateway.fm',
);

const SAMPLE_LSP8_ASSET = '0x8734600968c7e7193bb9b1b005677b4edbadcd18';

// Create contract instance
const myAssetContract = new ethers.Contract(
  SAMPLE_LSP8_ASSET,
  lsp8Artifact.abi,
  provider,
);

const erc725js = new ERC725(lsp8Schema);

// Token ID as Bytes32 value (1)
// https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md#lsp8tokenidformat
const byte32TokenId =
  '0x0000000000000000000000000000000000000000000000000000000000000001';

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

// https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md#lsp8tokenmetadatabaseuri
function decodeTokenId(encodedTokenId: string, tokenIdFormat: number) {
  switch (tokenIdFormat) {
    // Number
    case 0:
    case 100:
      return BigInt(encodedTokenId).toString();
    // String
    case 1:
    case 101:
      return ethers.toUtf8String(encodedTokenId).replace(/\0+$/, '');
    // Address
    case 2:
    case 102:
      return '0x' + encodedTokenId.slice(encodedTokenId.length - 40);
    // Byte Value
    case 3:
    case 103:
      // Extracts the non-zero portion (right padded)
      return encodedTokenId.replace(/0+$/, '');
    // Hash Digest
    case 4:
    case 104:
      // Hash digests are not modified during encoding, so return as is
      return encodedTokenId;
  }
}

async function fetchMetadataFromBaseURI(
  tokenID: string,
  tokenIdFormat: number,
) {
  let isLSP8 = false;
  try {
    // https://docs.lukso.tech/contracts/contracts/ERC725/#supportsinterface
    isLSP8 = await myAssetContract.supportsInterface(
      INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
    );
  } catch (err) {
    console.error(
      `Could not check if address ${SAMPLE_LSP8_ASSET} supports interface ${INTERFACE_IDS.LSP8IdentifiableDigitalAsset}, is it a smart contract address?`,
    );
    return;
  }

  if (!isLSP8) {
    console.log(
      `Contract: ${SAMPLE_LSP8_ASSET} does not support the LSP8 interface ID: ${INTERFACE_IDS.LSP8IdentifiableDigitalAsset}.`,
    );
    return;
  }

  /**
   * Retrieve and decode the Base URI
   * https://docs.lukso.tech/tools/erc725js/classes/ERC725#getdata
   *
   * Note: assets created with LSP versions below @lukso/lsp-smart-contracts@0.14.0
   * lack support for retrieving token ID metadata with BaseURI.
   * https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md#lsp8tokenmetadatabaseuri
   */
  let tokenBaseURI = await myAssetContract.getData(
    ERC725YDataKeys.LSP8['LSP8TokenMetadataBaseURI'],
  );

  if (tokenBaseURI === '0x') {
    console.log('BaseURI is not set.');
    return;
  }

  // If token ID format is mixed
  if (tokenIdFormat >= 100) {
    // Retrieve token ID format for the individual token ID
    // https://docs.lukso.tech/contracts/contracts/LSP8IdentifiableDigitalAsset/#getdatafortokenid
    tokenBaseURI = await myAssetContract.getDataForTokenId(
      tokenID,
      ERC725YDataKeys.LSP8['LSP8TokenIdFormat'],
    );
  }

  // Decode the baseURI
  // https://docs.lukso.tech/tools/erc725js/classes/ERC725#decodedata
  const decodedBaseURI = erc725js.decodeData([
    { keyName: 'LSP8TokenMetadataBaseURI', value: tokenBaseURI },
  ]);

  // Build valid link to JSON metadata
  let baseURLlink = decodedBaseURI[0].value.url;
  if (!baseURLlink.endsWith('/')) {
    baseURLlink += '/';
  }

  const decodedTokenID = decodeTokenId(tokenID, tokenIdFormat);
  const metadataJsonLink = `${baseURLlink}${decodedTokenID}`;

  // Fetch the URL
  const response = await fetch(metadataJsonLink);
  if (!response.ok) {
    throw new Error(`HTTP Response Error: ${response.status}`);
  }
  if (!response.json) {
    throw new Error('Metadata is not a JSON object');
  }
  const jsonMetadata = await response.json();
  console.log('Metadata Contents: ', jsonMetadata);
}

// Get the  global token ID format of the asset
const tokenIdFormat = await getTokenIdFormat();
console.log('Token ID Format: ', tokenIdFormat);

if (tokenIdFormat !== null) {
  fetchMetadataFromBaseURI(byte32TokenId, tokenIdFormat);
}
