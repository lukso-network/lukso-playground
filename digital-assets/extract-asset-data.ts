import { ERC725 } from '@erc725/erc725.js';
import LSP4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import { FetchDataOutput } from '@erc725/erc725.js/build/main/src/types/decodeData.js';

// https://docs.lukso.tech/networks/mainnet/parameters
const RPC_ENDPOINT = 'https://rpc.lukso.gateway.fm';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';

// 💡 Note: You can debug any smart contract by using the ERC725 Tools
// 👉 https://erc725-inspect.lukso.tech/inspector?address=0x61b083f1fb63ba2F064990f01B233B547ED4F5Cb&network=mainnet
const SAMPLE_ASSET_CONTRACT_ADDRESS =
  '0x61b083f1fb63ba2F064990f01B233B547ED4F5Cb';

// Parameters for the ERC725 instance
const config = { ipfsGateway: IPFS_GATEWAY };

// Fetchable Asset information
const assetImageLinks: any[] = [];
let fullSizeAssetImage;
const assetIconLinks: any[] = [];
let fullSizeIconImage;
let assetDescription;

/*
 * Get the dataset of an asset
 *
 * @param address of the asset
 * @return string of the encoded data
 */
async function fetchAssetData(address: string): Promise<FetchDataOutput> {
  try {
    const digitalAsset = new ERC725(LSP4Schema, address, RPC_ENDPOINT, config);

    const fetchedData = await digitalAsset.fetchData('LSP4Metadata');

    if (!fetchedData || !fetchedData.value) {
      throw new Error('Could not fetch profile data');
    }

    return fetchedData;
  } catch (error) {
    throw new Error(`Could not fetch asset data: ${error}`);
  }
}

/*
 * Read properties of an asset
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getAssetProperties(assetJSON: any) {
  let assetImageData: any = [];
  let iconImageData: any = [];

  try {
    if (assetJSON.value.LSP4Metadata.images[0]) {
      assetImageData = assetJSON.value.LSP4Metadata.images;
      for (const i in assetImageData) {
        assetImageLinks.push([
          i,
          assetImageData[i][0].url.replace('ipfs://', IPFS_GATEWAY),
        ]);
      }
      console.log(
        'Asset Image Links: ' +
          JSON.stringify(assetImageLinks, undefined, 2) +
          '\n',
      );

      fullSizeAssetImage = assetImageLinks[0][1];
      console.log('Full Size Asset Image Link: ' + fullSizeAssetImage + '\n');
    } else {
      console.log('Asset does not have image data \n');
    }

    if (assetJSON.value.LSP4Metadata.icon[0]) {
      iconImageData = assetJSON.value.LSP4Metadata.icon;
      for (const i in iconImageData) {
        assetIconLinks.push([
          i,
          iconImageData[i].url.replace('ipfs://', IPFS_GATEWAY),
        ]);
      }

      console.log(
        'Asset Icon Links: ' +
          JSON.stringify(assetIconLinks, undefined, 2) +
          '\n',
      );

      fullSizeIconImage = assetIconLinks[0][1];
      console.log('Full Size Icon Image Link: ' + fullSizeIconImage + '\n');
    } else {
      console.log('Asset does not have icon data');
    }

    if (assetJSON.value.LSP4Metadata.description) {
      assetDescription = assetJSON.value.LSP4Metadata.description;
      console.log('Asset Description: ' + assetDescription + '\n');
    } else {
      console.log('Asset does not have description data \n');
    }
  } catch (error) {
    console.log('Could not fetch all asset properties: ', error);
  }
}

// Debug

const main = async () => {
  const assetData = await fetchAssetData(SAMPLE_ASSET_CONTRACT_ADDRESS);
  console.log(JSON.stringify(assetData, undefined, 2));
  // TODO: this does not work
  // getAssetProperties(assetData);
};

main();
