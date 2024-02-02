import { ERC725 } from '@erc725/erc725.js';
import erc725schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import 'isomorphic-fetch';
import { FetchDataOutput } from '@erc725/erc725.js/build/main/src/types/decodeData.js';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';
const SAMPLE_PROFILE_ADDRESS = '0x9139def55c73c12bcda9c44f12326686e3948634';

// Parameters for ERC725 Instance
const config = { ipfsGateway: IPFS_GATEWAY };

// Fetchable metadata information
let name: string;
let description: string;
let links: any = [];
let firstLinkTitle: string;
let firstLinkURL: string;
let tags: string[] = [];
let firstTag;

// Fetchable picture information
const backgroundImageLinks: any[] = [];
let fullSizeBackgroundImg;
const profileImageLinks: any[] = [];
let fullSizeProfileImg;

/*
 * Fetch the @param's Universal Profile's
 * LSP3 data
 *
 * @param address of Universal Profile
 * @return string JSON or custom error
 */
async function fetchProfileData(address: string): Promise<FetchDataOutput> {
  try {
    const profile = new ERC725(erc725schema, address, RPC_ENDPOINT, config);

    const fetchedData = await profile.fetchData('LSP3Profile');

    if (!fetchedData || !fetchedData.value) {
      throw new Error('Could not fetch profile data');
    }

    return fetchedData;
  } catch (error) {
    throw new Error(`This is not an ERC725 Contract: ${error}`);
  }
}

/*
 * Fetch metadata information from the JSON dataset of
 * a Universal Profile
 */
async function fetchProfileMetadata(address: string) {
  const profileData = await fetchProfileData(address);

  if (
    profileData.value &&
    typeof profileData.value === 'object' &&
    'LSP3Profile' in profileData.value
  ) {
    // Read JSON
    name = profileData.value.LSP3Profile.name;
    description = profileData.value.LSP3Profile.description;
    links = profileData.value.LSP3Profile.links;
    firstLinkTitle = links[0].title;
    firstLinkURL = links[0].url;
    tags = profileData.value.LSP3Profile.tags;
    firstTag = tags[0];

    // Debug
    console.log('Name: ' + name);
    console.log('Description: ' + description + '\n');
    console.log('Links: ' + JSON.stringify(links, undefined, 2) + '\n');
    console.log('Title of first Link: ' + firstLinkTitle);
    console.log('URL of first Link: ' + firstLinkURL + '\n');
    console.log('Tags: ' + JSON.stringify(tags, undefined, 2) + '\n');
    console.log('First Tag: ' + firstTag + '\n');
  }
}

/* Fetch picture information from the JSON dataset of
 * a Universal Profile
 *
 * @return string Error
 */
async function fetchPictureData(address: string) {
  const pictureData = await fetchProfileData(address);

  if (
    pictureData.value &&
    typeof pictureData.value === 'object' &&
    'LSP3Profile' in pictureData.value
  ) {
    // Read JSON
    const backgroundImagesIPFS = pictureData.value.LSP3Profile.backgroundImage;
    const profileImagesIPFS = pictureData.value.LSP3Profile.profileImage;
    try {
      for (const i in backgroundImagesIPFS) {
        backgroundImageLinks.push([
          i,
          backgroundImagesIPFS[i].url.replace('ipfs://', IPFS_GATEWAY),
        ]);
      }

      for (const i in profileImagesIPFS) {
        profileImageLinks.push([
          i,
          profileImagesIPFS[i].url.replace('ipfs://', IPFS_GATEWAY),
        ]);
      }

      fullSizeBackgroundImg = backgroundImageLinks[0][1];
      fullSizeProfileImg = profileImageLinks[0][1];

      // Debug
      console.log('Fullsize Background Image: ' + fullSizeBackgroundImg + '\n');
      console.log('Fullsize Background Image: ' + fullSizeProfileImg + '\n');
      console.log(
        'Background Image Links: ' +
          JSON.stringify(backgroundImageLinks, undefined, 2) +
          '\n',
      );
      console.log(
        'Background Image Links: ' +
          JSON.stringify(profileImageLinks, undefined, 2) +
          '\n',
      );
    } catch (error) {
      return console.log('Could not fetch images: ', error);
    }
  }
}

// Debug
fetchProfileMetadata(SAMPLE_PROFILE_ADDRESS);
fetchPictureData(SAMPLE_PROFILE_ADDRESS);
