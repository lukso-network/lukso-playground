import { ERC725, encodeArrayKey } from '@erc725/erc725.js';
import LSP4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

// add 4 creators while extending the array length

// null value at index 2 and 5
const currentCreatorsArray = [
  '0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000000',
  '0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000001',
  null,
  '0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000003',
  '0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000004',
  null,
  '0x114bd03b3a46d48759680d81ebb2b41400000000000000000000000000000006',
  //  + add 2x new data keys
];

// null value at index 2 and 5
// let values = [
//   '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
//   '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
//   null,
//   '0xdddddddddddddddddddddddddddddddddddddddd',
//   '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
//   null,
//   '0xffffffffffffffffffffffffffffffffffffffff',
//  + 2x new creator addresses
// ];

// get all the indexes that are null = [2, 5]
const nullIndexes = currentCreatorsArray
  .map((val, idx) => (val === null ? idx : -1))
  .filter((index) => index !== -1);

const newCreators = [
  '0xcafecafecafecafecafecafecafecafecafecafe',
  '0xbeefbeefbeefbeefbeefbeefbeefbeefbeefbeef',
  '0xf00df00df00df00df00df00df00df00df00df00d',
  '0xba11ba11ba11ba11ba11ba11ba11ba11ba11ba11',
];

// 1. encode the data keys for the indexes that are null
let encodedDataKeys = nullIndexes.map((value) => {
  return encodeArrayKey(ERC725YDataKeys.LSP4['LSP4Creators[]'].index, value);
});

let encodedDataValues = [newCreators[0], newCreators[1]];

const erc725js = new ERC725(LSP4Schema);

// 2. add the new addresses in the array
const { keys: additionalDataKeys, values: additionalDataValues } =
  erc725js.encodeData([
    {
      keyName: 'LSP4Creators[]',
      value: newCreators.slice(2),
      startingIndex: currentCreatorsArray.length,
      totalArrayLength: currentCreatorsArray.length + newCreators.length - 2, // TODO improve the -2 logic to calculate that dynamically
    },
  ]);

encodedDataKeys = (additionalDataKeys as `0x${string}`[]).concat(
  encodedDataKeys,
);
encodedDataValues = additionalDataValues.concat(encodedDataValues);

console.log('encodedDataKeys = ', encodedDataKeys);
console.log('encodedDataValues = ', encodedDataValues);
