// Imports
import Web3 from 'web3';
import { ERC725 } from '@erc725/erc725.js';
import 'isomorphic-fetch';

// Static variables
const RPC_ENDPOINT = 'https://rpc.testnet.lukso.gateway.fm';
const IPFS_GATEWAY = 'https://api.universalprofile.cloud/ipfs';
const SAMPLE_PROFILE_ADDRESS = '0x9139def55c73c12bcda9c44f12326686e3948634';

// Parameters for ERC725 Instance
import erc725schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
const provider = new Web3.providers.HttpProvider(RPC_ENDPOINT);
const config = { ipfsGateway: IPFS_GATEWAY };

// Fetchable metadata information
let name;
let description;
let links = [];
let firstLinkTitle;
let firstLinkURL;
let tags = [];
let firstTag;

// Fetchable picture information
let backgroundImageLinks = [];
let fullSizeBackgroundImg;
let profileImageLinks = [];
let fullSizeProfileImg;

/*
 * Fetch the @param's Universal Profile's
 * LSP3 data
 *
 * @param address of Universal Profile
 * @return string JSON or custom error
 */
async function fetchProfileData(address) {
  try {
    const profile = new ERC725(erc725schema, address, provider, config);
    return await profile.fetchData('LSP3Profile');
  } catch (error) {
    return console.log('This is not an ERC725 Contract: ', error);
  }
}

/*
 * Fetch metadata information from the JSON dataset of
 * an Universal Profile
 */
async function fetchProfileMetadata(address) {
  const profileData = await fetchProfileData(address);
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

/* Fetch picture information from the JSON dataset of
 * a Universal Profile
 *
 * @return string Error
 */
async function fetchPictureData(address) {
  const pictureData = await fetchProfileData(address);

  // Read JSON
  let backgroundImagesIPFS = pictureData.value.LSP3Profile.backgroundImage;
  let profileImagesIPFS = pictureData.value.LSP3Profile.profileImage;
  try {
    for (let i in backgroundImagesIPFS) {
      backgroundImageLinks.push([
        i,
        backgroundImagesIPFS[i].url.replace('ipfs://', IPFS_GATEWAY),
      ]);
    }
    for (let i in profileImagesIPFS) {
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

// Debug
fetchProfileMetadata(SAMPLE_PROFILE_ADDRESS);
fetchPictureData(SAMPLE_PROFILE_ADDRESS);
