// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts <4.9.6
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimeCapsulezAsERC721 is ERC721, ERC721Burnable, Ownable {
    constructor(address initialOwner) ERC721("Time Capsulez", "TCZ") {
        _transferOwnership(initialOwner);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}

// modules
import {
    LSP8IdentifiableDigitalAsset
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {
    LSP8Burnable
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/extensions/LSP8Burnable.sol";

// constants
import {
    _LSP4_TOKEN_TYPE_COLLECTION
} from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";
import {
    _LSP8_TOKENID_FORMAT_NUMBER
} from "@lukso/lsp8-contracts/contracts/LSP8Constants.sol";

contract TimeCapsulezAsLSP8 is LSP8IdentifiableDigitalAsset, LSP8Burnable {
    constructor(
        address initialOwner
    )
        LSP8IdentifiableDigitalAsset(
            "Time Capsulez",
            "TCZ",
            initialOwner,
            _LSP4_TOKEN_TYPE_COLLECTION, // number `2`
            _LSP8_TOKENID_FORMAT_NUMBER // number `0`
        )
    {}
}
