// SPDC-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

// interfaces
import {
    ILSP1UniversalReceiver as ILSP1
} from "@lukso/lsp-smart-contracts/contracts/LSP1UniversalReceiver/ILSP1UniversalReceiver.sol";

// modules
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// errors

import "@lukso/lsp-smart-contracts/contracts/LSP1UniversalReceiver/LSP1Errors.sol";

contract NewsSubscription is ILSP1, Ownable {
    /**
     * @dev Notify when some news related to a specific topic (e.g: Politics, Astronomy, Sports, ...) has been
     * published. For users to be notified based on their interests.
     *
     * @param typeId The typeId related to a specific new topic
     * @param data Any arbitrary data sent alongisde the notification
     */
    function universalReceiver(
        bytes32 typeId,
        bytes memory data
    ) external payable onlyOwner returns (bytes memory) {
        require(
            msg.value == 0,
            "Function just intended for notification, not to receive funds"
        );

        emit UniversalReceiver({
            from: msg.sender,
            value: 0,
            typeId: typeId,
            receivedData: data,
            returnedValue: abi.encodePacked(
                "Latest news available for topic ID: ",
                typeId
            )
        });

        return "";
    }
}
