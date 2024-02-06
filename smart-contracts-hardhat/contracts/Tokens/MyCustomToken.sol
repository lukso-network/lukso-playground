// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import {LSP7Mintable} from "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";
import {LSP7Burnable} from "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/extensions/LSP7Burnable.sol";

import {_LSP4_TOKEN_TYPE_TOKEN} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

contract CustomToken is LSP7Mintable, LSP7Burnable {

  // Technical Documentation: https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-7-DigitalAsset.md
  constructor(
    string memory name,
    string memory symbol,
    address contractOwner,
    uint256 lsp4TokenType,
    bool isNonDivisible
  ) LSP7Mintable(
    name, 
    symbol, 
    contractOwner, 
    lsp4TokenType, 
    isNonDivisible) {
    mint(msg.sender, 20000 * 10**decimals(), true, '0x' );
  }
  // Your custom smart contract logic...
}