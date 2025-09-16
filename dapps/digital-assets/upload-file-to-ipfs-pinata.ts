import { createReadStream } from 'fs';
import { PinataUploader } from '@lukso/data-provider-pinata';

const provider = new PinataUploader({
  pinataJWTKey: '...', // add your Piñata JWT token here
});

// you can use this script to upload to IPFS:
// - the images associated with the asset metadata
const file = createReadStream('./my-image.png');

// - the JSON file containing all the LSP4Metadata
// const file = createReadStream('./asset-metadata.json');

const { url, hash } = await provider.upload(file);

console.log('Successfully uploaded to IPFS using Piñata!');
console.log('url: ', url);
console.log('hash: ', hash);
