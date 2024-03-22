// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^4.9.3
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// modules
import {
    LSP7DigitalAsset
} from "@lukso/lsp7-contracts/contracts/LSP7DigitalAsset.sol";
import {
    LSP7Burnable
} from "@lukso/lsp7-contracts/contracts/extensions/LSP7Burnable.sol";
import {
    LSP7Mintable
} from "@lukso/lsp7-contracts/contracts/presets/LSP7Mintable.sol";

// constants
import {
    _LSP4_TOKEN_TYPE_TOKEN
} from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";

contract EcoCoin is LSP7Burnable, LSP7Mintable {
    constructor(
        address initialOwner
    )
        LSP7Mintable(
            "EcoCoin", // name
            "ECN", // symbol
            initialOwner, // contract owner
            _LSP4_TOKEN_TYPE_TOKEN, // token type
            false // is non divisible
        )
    {
        _mint({
            to: initialOwner,
            amount: 10_000 * 10 ** decimals(), // 10_000_000_000_000_000_000_000
            force: true, // allowing to send to EOA as well
            data: bytes(unicode"Minting some tokens!!! 🔥🫡")
        });
    }
}
