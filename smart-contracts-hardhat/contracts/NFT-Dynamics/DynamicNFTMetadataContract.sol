// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// modules
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";

contract DynamicNFT is ERC725Y {

    bytes32 constant _LSP8_REFERENCE_CONTRACT = 0x708e7b881795f2e6b6c2752108c177ec89248458de3bf69d0d43480b3e5034e6;

    constructor(address nftOwner, address nftCollection) ERC725Y(nftOwner) {
        /**
         * @dev set the reference to the NFT collection that this metadata contract belongs to
         *
         * {
         *     "name": "LSP8ReferenceContract",
         *     "key": "0x708e7b881795f2e6b6c2752108c177ec89248458de3bf69d0d43480b3e5034e6",
         *     "keyType": "Singleton",
         *     "valueType": "(address,bytes32)",
         *     "valueContent": "(Address,bytes32)"
         * }
         */
        _setData(_LSP8_REFERENCE_CONTRACT, abi.encodePacked(nftCollection, bytes32(bytes20(address(this)))));
    }
}