// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

// interfaces
import {
    ILSP1UniversalReceiverDelegate as ILSP1Delegate
} from "@lukso/lsp-smart-contracts/contracts/LSP1UniversalReceiver/ILSP1UniversalReceiverDelegate.sol";

// modules
import {ERC725Y} from "@erc725/smart-contracts/contracts/ERC725Y.sol";

// libraries
import {
    LSP2Utils
} from "@lukso/lsp-smart-contracts/contracts/LSP2ERC725YJSONSchema/LSP2Utils.sol";

contract TokensSpamRegistry is ILSP1Delegate, ERC725Y {
    using LSP2Utils for bytes10;

    bytes10 constant _TOKEN_BLACKLISTED_DATA_KEY = 0x86c8f139b2bad93b0e82;

    constructor(address contractOwner) ERC725Y(contractOwner) {}

    /**
     * @dev Register this token contract in the blacklist, to mention it is a spam token.
     *
     * @custom:info This is just a helper function on top of ERC725Y.
     * The same can be achieved by calling the public function `setData(bytes32,bytes)`
     */
    function registerTokenAsSpam(address token) external onlyOwner {
        bytes32 blacklistedDataKey = _TOKEN_BLACKLISTED_DATA_KEY
            .generateMappingKey(bytes20(token));

        _setData(blacklistedDataKey, abi.encodePacked(true));
    }

    /**
     *
     * @dev Check if the token received (`notifier` param) is registered in the blacklist.
     * If the token is blacklisted, reverts the transaction to prevent receiving it
     */
    function universalReceiverDelegate(
        address notifier,
        uint256 /* value */,
        bytes32 /* typeId */,
        bytes memory /* data */
    ) external view returns (bytes memory) {
        // 1. Generate the Mapping Data Key for this specific token address
        bytes32 blacklistedDataKey = _TOKEN_BLACKLISTED_DATA_KEY
            .generateMappingKey(bytes20(notifier));

        bytes memory value = _getData(blacklistedDataKey);

        bool isTokenBlacklisted = value[0] == 0x01 ? true : false;

        if (isTokenBlacklisted) {
            revert("Spam prevention: cannot receive blacklisted token");
        }

        return "Token not blacklisted, allowed to be received";
    }
}
