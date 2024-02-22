import ERC725 from '@erc725/erc725.js';
import LSP4schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import POAPMetadata from './POAPMetadata.json';

const erc725 = new ERC725(LSP4schema);

const encodedMetadata = erc725.encodeData([
  {
    keyName: 'LSP4Metadata',
    value: {
      json: POAPMetadata,
      url: 'ipfs://QmUmtzg9CaAhrxapGJwJyiuorMbZryajn2ipumi32VcY7H',
    },
  },
]);

const decodedMetadata = erc725.decodeData([
  {
    keyName: 'LSP4Metadata',
    value: encodedMetadata.values[0],
  },
]);

console.log('encodedMetadata: ', encodedMetadata);
console.log('decodedMetadata: ', decodedMetadata);
