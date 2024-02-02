import { ERC725 } from '@erc725/erc725.js';
import lsp4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

async function fetchJSONData() {
  // Instantiate erc725.js
  const erc725js = new ERC725(
    lsp4Schema,
    '0x0514A829C832639Afcc02D257154A9DaAD8fa21B', // LSP7 Address
    'https://rpc.testnet.lukso.gateway.fm',
    {
      ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
    },
  );

  // Download and verify the asset metadata JSON file
  const assetMetadata = await erc725js.fetchData('LSP4Metadata');

  // Print simplified JSON
  console.log(assetMetadata);

  // Print full JSON
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
      dynamicKeyParts: '0x9139def55c73c12bcda9c44f12326686e3948634',
    },
  ]);
  console.log(creatorInformation);
}

fetchJSONData();
