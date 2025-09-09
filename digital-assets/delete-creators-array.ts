import { encodeArrayKey } from '@erc725/erc725.js';

import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts';

const arrayLength = 5;

const result = () => {
  const dataKeys = [ERC725YDataKeys.LSP4['LSP4Creators[]'].length];
  const dataValues = ['0x00000000000000000000000000000000'];

  for (let index = 0; index < arrayLength; index++) {
    dataKeys.push(
      encodeArrayKey(ERC725YDataKeys.LSP4['LSP4Creators[]'].length, index),
    );
    dataValues.push('0x');
  }

  return { dataKeys, dataValues };
};

console.log(result());
