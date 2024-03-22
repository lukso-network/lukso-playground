// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts <4.9.6
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoCoinAsERC20 is ERC20, ERC20Burnable, Ownable {
    constructor(address initialOwner) ERC20("EcoCoin", "ECN") {
        _transferOwnership(initialOwner);
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

// --------

// modules
import {
    LSP7DigitalAsset
} from "@lukso/lsp7-contracts/contracts/LSP7DigitalAsset.sol";
import {
    LSP7Burnable
} from "@lukso/lsp7-contracts/contracts/extensions/LSP7Burnable.sol";

// constants
import {
    _LSP4_TOKEN_TYPE_TOKEN
} from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";

contract EcoCoinAsLSP7 is LSP7DigitalAsset, LSP7Burnable {
    constructor(
        address initialOwner
    )
        LSP7DigitalAsset(
            "EcoCoin",
            "ECN",
            initialOwner,
            _LSP4_TOKEN_TYPE_TOKEN,
            false
        )
    {
        _mint(msg.sender, 10_000 * 10 ** decimals(), true, "0x");
    }
}
