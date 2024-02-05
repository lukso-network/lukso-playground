// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// interfaces
import {
    ILSP25ExecuteRelayCall as ILSP25
} from "@lukso/lsp-smart-contracts/contracts/LSP25ExecuteRelayCall/ILSP25ExecuteRelayCall.sol";

// modules
import {
    LSP8IdentifiableDigitalAsset
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {
    LSP25MultiChannelNonce
} from "@lukso/lsp-smart-contracts/contracts/LSP25ExecuteRelayCall/LSP25MultiChannelNonce.sol";

// constants
import {
    _LSP4_TOKEN_TYPE_NFT
} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {
    _LSP8_TOKENID_FORMAT_HASH
} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";

contract DelegatedVoting is
    ILSP25,
    LSP8IdentifiableDigitalAsset(
        "Election",
        "ELC",
        msg.sender, // deployer (organiser of the election),
        _LSP4_TOKEN_TYPE_NFT,
        _LSP8_TOKENID_FORMAT_HASH
    ),
    LSP25MultiChannelNonce
{
    modifier noNativeTokens() {
        require(msg.value == 0, "Not aimed to receive native tokens");
        _;
    }

    modifier notInCastingPeriod() {
        require(
            block.timestamp > _castingPeriodStartAt,
            "Votes cannot be submitted yet"
        );
        require(
            block.timestamp < _castingPeriodEnd,
            "Voting period has passed"
        );
        _;
    }

    uint256 immutable _castingPeriodStartAt;
    uint256 immutable _castingPeriodEnd;

    constructor(uint256 castingPeriodStartAt_, uint256 castingPeriodEnd_) {
        _castingPeriodStartAt = castingPeriodStartAt_;
        _castingPeriodEnd = castingPeriodEnd_;
    }

    function getNonce(
        address from,
        uint128 channelId
    ) external view returns (uint256) {
        return _getNonce(from, channelId);
    }

    function retrieveUserVote() public {
        _mint({
            to: msg.sender,
            tokenId: keccak256(abi.encodePacked(msg.sender)),
            force: true,
            data: ""
        });
    }

    /**
     * @dev Allow anyone to vote on behalf of someone else, providing a valid signature
     */
    function executeRelayCall(
        bytes calldata signature,
        uint256 nonce,
        uint256 validityTimestamps,
        bytes calldata payload
    ) public payable noNativeTokens notInCastingPeriod returns (bytes memory) {
        // 1. retrieve the address of the voter from the signature
        address voter = LSP25MultiChannelNonce._recoverSignerFromLSP25Signature(
            signature,
            nonce,
            validityTimestamps,
            0,
            payload
        );

        if (!_isValidNonce(voter, nonce)) {
            revert("Invalid nonce");
        }

        // 2. increase nonce after successful verification
        _nonceStore[voter][nonce >> 128]++;

        // 3. extract the parameters from the calldata `transfer(address,address,bytes32,bool,bytes)`
        (
            address from,
            address candidate,
            bytes32 voteId,
            bool force,
            bytes memory data
        ) = abi.decode(payload, (address, address, bytes32, bool, bytes));

        require(
            from == voter,
            "recovered address of `voter` does not match the from sending address"
        );

        // 4. The tokenId to represent the vote of someone is the hash of the address that voted
        require(
            voteId == keccak256(abi.encodePacked(voter)),
            "Invalid vote ID for voter"
        );

        // 5. Cast the vote by transferring it to the candidate.
        // This will increase the vote count of the `candidate`
        _transfer({
            from: voter,
            to: candidate,
            tokenId: voteId,
            force: force,
            data: data
        });

        return
            abi.encodePacked(
                "Vote from address ",
                voter,
                " casted successfully!"
            );
    }

    function executeRelayCallBatch(
        bytes[] calldata signatures,
        uint256[] calldata nonces,
        uint256[] calldata validityTimestamps,
        uint256[] calldata values,
        bytes[] calldata payloads
    ) public payable noNativeTokens returns (bytes[] memory) {
        if (
            signatures.length != nonces.length ||
            nonces.length != validityTimestamps.length ||
            validityTimestamps.length != values.length ||
            values.length != payloads.length
        ) {
            revert("Batch ExecuteRelayCall Params Length Mismatch");
        }

        bytes[] memory castedVotes = new bytes[](payloads.length);

        for (uint256 ii; ii < payloads.length; ++ii) {
            require(values[ii] == 0, "Batch entry cannot contain value");

            // cast each votes one by one
            castedVotes[ii] = executeRelayCall(
                signatures[ii],
                nonces[ii],
                validityTimestamps[ii],
                payloads[ii]
            );
        }

        return castedVotes;
    }
}
