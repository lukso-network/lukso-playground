// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

// modules
import {
    LSP8IdentifiableDigitalAsset as LSP8
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

// libraries
import {
    LSP2Utils
} from "@lukso/lsp-smart-contracts/contracts/LSP2ERC725YJSONSchema/LSP2Utils.sol";

// constants
import {
    _INTERFACEID_LSP0
} from "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0Constants.sol";
import {
    _LSP4_TOKEN_TYPE_NFT,
    _LSP4_METADATA_KEY,
    _LSP4_METADATA_KEY,
    _LSP4_CREATORS_ARRAY_KEY,
    _LSP4_CREATORS_MAP_KEY_PREFIX
} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {
    _LSP8_TOKENID_FORMAT_UNIQUE_ID
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";

function generateKeccak256Utf8VerifiableURI(
    bytes32 verificationDataHash,
    string memory uri
) pure returns (bytes memory) {
    return
        abi.encodePacked(
            // verifiableURI identifier
            bytes2(0x0000),
            // verification method ID.
            // first 4 bytes of the keccak256 hash of the string "keccak256(utf8)"
            bytes4(0x6f357c6a),
            // verification data length
            bytes2(0x0020),
            // verification data
            verificationDataHash,
            // encoded URI
            uri
        );
}

contract MyLUKSOPoap is
    LSP8(
        "My LUKSO POAP",
        "LYXPOAP",
        msg.sender, // deployer of the contract is the owner
        _LSP4_TOKEN_TYPE_NFT, // each token on the contract represent an NFT
        _LSP8_TOKENID_FORMAT_UNIQUE_ID // each tokenId will be represented as a unique ID constructed as the hash of the user address who claimed the POAP
    )
{
    // using {generateArrayElementKeyAtIndex} for bytes32;
    using LSP2Utils for *;

    /// @notice Replace the address below with your UP address here to define yourself as the creator.
    /// @dev For people who do not have a UP, simply leave this address for demo purpose (it is my UP address).
    address constant WORKSHOP_CREATOR =
        0x38382B0437453004AC1af86839249037b130417B;

    constructor(
        bytes32 verificationDataHash,
        string memory poapMetadataIPFSURI
    ) {
        bytes memory poapVerifiableURI = generateKeccak256Utf8VerifiableURI(
            verificationDataHash,
            poapMetadataIPFSURI
        );

        _setData(_LSP4_METADATA_KEY, poapVerifiableURI);

        // There is only one creator: yourself!

        // Set the LSP4 Creator Array length to 1
        _setData(
            _LSP4_CREATORS_ARRAY_KEY,
            abi.encodePacked(bytes16(uint128(1)))
        );

        // Set your UP address under the LSP4_CREATORS[] at index 0
        bytes32 lsp4CreatorArrayAtIndex = _LSP4_CREATORS_ARRAY_KEY
            .generateArrayElementKeyAtIndex(0);

        _setData(lsp4CreatorArrayAtIndex, abi.encodePacked(WORKSHOP_CREATOR));

        bytes32 lsp4CreatorMapKey = _LSP4_CREATORS_MAP_KEY_PREFIX
            .generateMappingKey(bytes20(WORKSHOP_CREATOR));

        _setData(
            lsp4CreatorMapKey,
            abi.encodePacked(_INTERFACEID_LSP0, uint128(0))
        );
    }

    function claim() external {
        bytes32 tokenId = keccak256(abi.encode(msg.sender));
        _mint(msg.sender, tokenId, true, "");

        // set the same metadata for the tokenId than the LSP4Metadata
        bytes memory lsp4MetadataValue = _getData(_LSP4_METADATA_KEY);
        _setDataForTokenId(tokenId, _LSP4_METADATA_KEY, lsp4MetadataValue);
    }

    function _transfer(
        address /* from */,
        address /* to */,
        bytes32 /* tokenId */,
        bool /* force */,
        bytes memory /* data */
    ) internal pure override {
        revert("LUKSO POAP is non-transferrable");
    }
}
