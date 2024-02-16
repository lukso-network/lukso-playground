import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';

import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import { INTERFACE_IDS, ERC725YDataKeys } from '@lukso/lsp-smart-contracts/constants';
import lsp8Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';

const SAMPLE_LSP8_ASSET = '0x8734600968c7e7193BB9B1b005677B4edBaDcD18';
const RPC_URL = 'https://rpc.testnet.lukso.gateway.fm';

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create contract instance
const myAsset = new ethers.Contract(SAMPLE_LSP8_ASSET, lsp8Artifact.abi, provider);

/**
 * Note: assets created with LSP versions below @lukso/lsp-smart-contracts@0.14.0
 * lack support for retrieving token ID metadata.
 */
const isLSP8 = await myAsset.supportsInterface(INTERFACE_IDS.LSP8IdentifiableDigitalAsset);

async function fetchTokenIdMetadata() {
  if (!isLSP8) {
    console.log('Asset is not an LSP8.');
    return;
  }

  // Token ID as Bytes32 value (1)
  const tokenID = '0x0000000000000000000000000000000000000000000000000000000000000001';

  // Get the encoded asset metadata
  const tokenIdMetadata = await myAsset.getDataForTokenId(
    tokenID,
    ERC725YDataKeys.LSP4['LSP4Metadata'],
  );

  const erc725js = new ERC725(lsp4Schema);

  // Decode the metadata
  const decodedMetadata = erc725js.decodeData([
    {
      keyName: 'LSP4Metadata',
      value: tokenIdMetadata,
    },
  ]);

  console.log('Contract Metadata: ', JSON.stringify(decodedMetadata, undefined, 2));

  // Get the contentID or file link
  let contentID = decodedMetadata[0].value.url;
  console.log('ContentID: ', contentID);

  // Get the BaseURI of the storage provider
  // https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md#lsp8tokenmetadatabaseuri
  let tokenBaseURI = await myAsset.getData(ERC725YDataKeys.LSP8['LSP8TokenMetadataBaseURI']);
  console.log('BaseURI: ', tokenBaseURI);

  if (tokenBaseURI === '0x') {
    // If no BaseURI was set, use a default IPFS gateway
    tokenBaseURI = 'https://api.universalprofile.cloud/ipfs/';
    // Prepare IPFS link to fetch
    contentID = contentID.replace('ipfs://', '');
  }

  const fileUrl = tokenBaseURI + contentID;

  // Retrieve the metadata contents
  const response = await fetch(fileUrl);
  const jsonMetadata = await response.json();
  console.log('Metadata Contents: ', JSON.stringify(jsonMetadata, undefined, 2));
}
fetchTokenIdMetadata();
