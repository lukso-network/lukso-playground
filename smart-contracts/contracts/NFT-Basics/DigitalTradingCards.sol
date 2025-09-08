// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// modules
import {
    LSP7Mintable
} from "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";

// constants
import {
    _LSP4_TOKEN_TYPE_NFT
} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

contract DigitalTradingCards is
    LSP7Mintable(
        "Digital Trading Card",
        "DTC",
        msg.sender,
        _LSP4_TOKEN_TYPE_NFT,
        true // cards are non divisible (you cannot tear a card in 2 and give me half)
    )
{
    // contract logic goes here...
}
