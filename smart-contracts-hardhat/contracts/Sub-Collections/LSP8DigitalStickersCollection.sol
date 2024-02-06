// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// modules
import {
    LSP8IdentifiableDigitalAsset
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {LSP7DigitalStickers} from "./LSP7DigitalStickers.sol";

// constants
import {
    _LSP8_TOKENID_FORMAT_ADDRESS,
    _LSP8_REFERENCE_CONTRACT
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {
    _LSP4_TOKEN_TYPE_COLLECTION
} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

/**
 * @dev Pseudo code example, LSP8 collection of digital stickers, where each sticker is a LSP7 contract with a limited supply available.
 * This contract is for testing and tutorial purpose.
 */
contract LSP8DigitalStickersCollection is
    LSP8IdentifiableDigitalAsset(
        "Example Digital Stickers Collection",
        "EDSC",
        msg.sender,
        _LSP4_TOKEN_TYPE_COLLECTION,
        _LSP8_TOKENID_FORMAT_ADDRESS
    )
{
    // Constants ---

    bytes32 internal constant _STICKER_PRICE_DATA_KEY =
        keccak256("Price Per Sticker");

    // Errors ---

    error FailedDeployingLSP7StickerContract(string stickerName);

    function createNewStickerCollection(
        string calldata stickerName,
        string calldata stickerSymbol,
        uint256 numberOfStickers,
        uint256 pricePerSticker // in wei
    ) external onlyOwner {
        try
            new LSP7DigitalStickers(
                stickerName,
                stickerSymbol,
                address(this),
                numberOfStickers
            )
        returns (LSP7DigitalStickers newSticker) {
            // example:
            // newSticker (contract address)= 0x9760e8347D5E8f9042726E3B4DdE9Ae787476101

            // NFT tokenId will be 0x0000000000000000000000009760e8347D5E8f9042726E3B4DdE9Ae787476101
            bytes32 stickerId = bytes32(abi.encode(address(newSticker)));

            bytes32[] memory dataKeysToSet = new bytes32[](2);
            bytes[] memory dataValuesToSet = new bytes[](2);

            // Set Data Key "LSP8ReferenceContract",
            dataKeysToSet[0] = _LSP8_REFERENCE_CONTRACT;
            dataValuesToSet[0] = abi.encodePacked(address(this), stickerId); // "valueType": "(address,bytes32)"

            // Set Data Key specific to the price per sticker
            dataKeysToSet[1] = _STICKER_PRICE_DATA_KEY;
            dataValuesToSet[1] = abi.encode(pricePerSticker);

            newSticker.setDataBatch(dataKeysToSet, dataValuesToSet);

            // need to pass `force = true` as will attempt to notify `universalReceiver` function of this contract
            // which does not implement LSP1
            _mint({
                to: address(this),
                tokenId: stickerId,
                force: true,
                data: ""
            });
        } catch (bytes memory) {
            revert FailedDeployingLSP7StickerContract(stickerName);
        }
    }
}
