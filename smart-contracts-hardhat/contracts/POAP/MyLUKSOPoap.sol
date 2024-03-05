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

contract MyLUKSOPoap is
    LSP8(
        "My LUKSO POAP",
        "LYXPOAP",
        // deployer of the contract is the owner
        msg.sender,
        // each token on the contract represent an NFT
        _LSP4_TOKEN_TYPE_NFT,
        _LSP8_TOKENID_FORMAT_UNIQUE_ID // each tokenId will be represented as a unique ID
    )
{
    using LSP2Utils for *;

    /// @notice Replace the address below with your UP address here to define yourself as the creator.
    /// @dev For people who do not have a UP, simply leave this address for demo purpose (it is my UP address).
    address constant POAP_CREATOR = 0x87cC4Edf3E4EfF2eD959Db21e2C1295D401B7983;

    /// @notice Replace with the Verifiable URI for the design of your POAP
    /// @dev Or leave it as it is to keep the default one `poap-icon-default.png`.
    bytes constant VERIFIABLE_URI =
        hex"00006f357c6a0020f54eb9ca225c71ad8631576512a36c72bc9a367164545e7b9e4c6f9e770dabc2697066733a2f2f516d556d747a67394361416872786170474a774a7969756f724d625a7279616a6e326970756d6933325663593748";

    constructor() {
        _setData(_LSP4_METADATA_KEY, VERIFIABLE_URI);

        // There is only one creator: yourself!

        // Set the LSP4 Creator Array length to 1
        _setData(
            _LSP4_CREATORS_ARRAY_KEY,
            abi.encodePacked(bytes16(uint128(1)))
        );

        // Set your UP address under the LSP4_CREATORS[] at index 0
        bytes32 lsp4CreatorArrayAtIndex = _LSP4_CREATORS_ARRAY_KEY
            .generateArrayElementKeyAtIndex(0);

        _setData(lsp4CreatorArrayAtIndex, abi.encodePacked(POAP_CREATOR));

        bytes32 lsp4CreatorMapKey = _LSP4_CREATORS_MAP_KEY_PREFIX
            .generateMappingKey(bytes20(POAP_CREATOR));

        _setData(
            lsp4CreatorMapKey,
            abi.encodePacked(_INTERFACEID_LSP0, uint128(0))
        );
    }

    /// @dev The tokenId for the POAP of each user is constructed as the hash of the user address who claimed it.
    /// The hashed address is packed encoded (not zero left padded) so that we can easily re-calculate the tokenId
    /// by simply copy pasting the 20 bytes address in hashing tool like keccak256 online
    // https://emn178.github.io/online-tools/keccak_256.html
    function claim() external {
        bytes32 tokenId = keccak256(abi.encodePacked(msg.sender));
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
