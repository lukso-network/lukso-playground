import { ERC725 } from '@erc725/erc725.js';
import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

async function fetchJSONData() {
  // Instantiate erc725.js
  const erc725js = new ERC725(
    lsp4Schema,
    '0xbA712C92C6e10f22d7C737f9BC7dAa22B65548F7', // Asset address (LSP7 or LSP8)
    'https://4201.rpc.thirdweb.com',
    {
      ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
    },
  );

  // Download and verify the asset metadata JSON file
  const assetMetadata = await erc725js.fetchData('LSP4Metadata');

  // Print simplified JSON
  console.log(assetMetadata);

  // Print full JSON metadata
  console.log(JSON.stringify(assetMetadata, null, 2));

  // Fetch all creators of the asset
  const assetCreatorsList = await erc725js.fetchData('LSP4Creators[]');
  console.log(assetCreatorsList);

  // Fetch the asset's token type
  const tokenType = await erc725js.fetchData('LSP4TokenType');
  console.log(tokenType);

  // Fetch the asset's token symbol
  const tokenSymbol = await erc725js.fetchData('LSP4TokenSymbol');
  console.log(tokenSymbol);

  // Fetch the asset's token name
  const tokenName = await erc725js.fetchData('LSP4TokenName');
  console.log(tokenName);

  // Fetch creator-specific information
  const creatorInformation = await erc725js.fetchData([
    /*
     * for dynamic keys, it is necessary
     * to provide any second data key
     */
    'LSP4TokenName',
    {
      keyName: 'LSP4CreatorsMap:<address>',
      // Sample creator address
      dynamicKeyParts: (assetCreatorsList.value as string[])[0],
    },
  ]);
  console.log(creatorInformation);
}

fetchJSONData();
