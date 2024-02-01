// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import {LSP7Mintable} from "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";
import {LSP7Burnable} from "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/extensions/LSP7Burnable.sol";

import {_LSP4_TOKEN_TYPE_TOKEN} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

contract CustomToken is LSP7Mintable, LSP7Burnable {
  // parameters for LSP7Mintable constructor are:
  // token name,
  // token symbol,
  // token owner,
  // boolean isNonDivisible
  // for more informations, check https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-7-DigitalAsset.md
  constructor() LSP7Mintable("My Custom Token", "MCT", msg.sender, _LSP4_TOKEN_TYPE_TOKEN, false) {
    mint(msg.sender, 20000 * 10**decimals(), true, '0x' );
  }
}