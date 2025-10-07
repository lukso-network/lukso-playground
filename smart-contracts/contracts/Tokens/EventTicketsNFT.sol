// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// modules
import {
    LSP7Mintable
} from "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";

// constants
import {
    _LSP4_TOKEN_TYPE_TOKEN
} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

contract EventTicketsNFT is LSP7Mintable {
    constructor(
        string memory eventName,
        string memory tokenSymbol,
        address contractOwner
    )
        LSP7Mintable(
            eventName,
            tokenSymbol,
            contractOwner,
            _LSP4_TOKEN_TYPE_TOKEN,
            true // make the token non divisible
        )
    {}
}
