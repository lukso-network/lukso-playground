import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';

import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import {
  INTERFACE_IDS,
  ERC725YDataKeys,
} from '@lukso/lsp-smart-contracts/constants';
import lsp8Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';

const SAMPLE_LSP8_ASSET = '0x8734600968c7e7193BB9B1b005677B4edBaDcD18';
const RPC_URL = 'https://rpc.testnet.lukso.gateway.fm';

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create contract instance
const myAssetContract = new ethers.Contract(
  SAMPLE_LSP8_ASSET,
  lsp8Artifact.abi,
  provider,
);

// Token ID as Bytes32 value (1)
// https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md#lsp8tokenidformat
const byte32TokenId =
  '0x0000000000000000000000000000000000000000000000000000000000000001';

async function fetchTokenIdMetadata(tokenID: string) {
  let isLSP8 = false;

  try {
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
   * Get the encoded asset metadata
   * https://docs.lukso.tech/contracts/contracts/LSP8IdentifiableDigitalAsset/#getdatafortokenid
   */
  const tokenIdMetadata = await myAssetContract.getDataForTokenId(
    tokenID,
    ERC725YDataKeys.LSP4['LSP4Metadata'],
  );

  const erc725js = new ERC725(lsp4Schema);

  /**
   * Decode the metadata
   * https://docs.lukso.tech/tools/erc725js/classes/ERC725#decodedata
   */
  const decodedMetadata = erc725js.decodeData([
    {
      keyName: 'LSP4Metadata',
      value: tokenIdMetadata,
    },
  ]);

  console.log(
    'Decoded Metadata: ',
    JSON.stringify(decodedMetadata, undefined, 2),
  );

  // Get Value of the URL to retrieve JSON
  const metadataURL = decodedMetadata[0].value.url;

  // Generate link to JSON metadata
  const metadataJsonLink = generateMetadataLink(metadataURL);

  // Fetch the URL
  if (metadataJsonLink) {
    const response = await fetch(metadataJsonLink);
    const jsonMetadata = await response.json();
    console.log('Metadata JSON: ', jsonMetadata);
  } else {
    console.log('Could not generate metadata link based on value.url content.');
  }
}

function generateMetadataLink(link: string) {
  // If link is a regular Web2 Link, it can be passed back
  if (link.startsWith('https://') || link.startsWith('http://')) {
    return link;
  }
  // If link has custom protocoll, adjust the link
  if (link.startsWith('ipfs://')) {
    // Use your default IPFS Gateway address
    const ipfsHash = link.slice(7);
    return `https://api.universalprofile.cloud/ipfs/${ipfsHash}`;
  } else {
    return null;
  }

  // Handle other cases if needed ...
}

fetchTokenIdMetadata(byte32TokenId);
