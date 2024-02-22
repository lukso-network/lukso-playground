import { ethers } from 'ethers';
import { ERC725 } from '@erc725/erc725.js';

import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import { INTERFACE_IDS, ERC725YDataKeys } from '@lukso/lsp-smart-contracts/constants';
import lsp8Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';

const SAMPLE_LSP8_ASSET = '0x8734600968c7e7193BB9B1b005677B4edBaDcD18';
const RPC_URL = 'https://rpc.testnet.lukso.gateway.fm';

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create contract instance
const myAssetContract = new ethers.Contract(SAMPLE_LSP8_ASSET, lsp8Artifact.abi, provider);

// Token ID as Bytes32 value (1)
const byte32TokenId = '0x0000000000000000000000000000000000000000000000000000000000000001';

async function fetchTokenIdMetadata(tokenID: string) {
  const isLSP8 = await myAssetContract.supportsInterface(
    INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
  );

  if (!isLSP8) {
    console.log('Asset is not an LSP8.');
    return;
  }

  /**
   *  Get the encoded asset metadata
   * Note: assets created with LSP versions below @lukso/lsp-smart-contracts@0.14.0
   * lack support for retrieving token ID metadata.
   */
  const tokenIdMetadata = await myAssetContract.getDataForTokenId(
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

  console.log('Decoded Metadata: ', JSON.stringify(decodedMetadata, undefined, 2));
}

fetchTokenIdMetadata(byte32TokenId);
