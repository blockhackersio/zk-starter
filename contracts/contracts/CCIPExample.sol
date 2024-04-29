// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CCIPExample is CCIPReceiver, AccessControl {
    /// Chainlink CCIP Router Address - used to send messages across chains
    IRouterClient public immutable router;

    // gas limit for CCIP message
    uint256 gasLimit = 400_000;

    // hash of address + chain id to t/f to determine if this address is allowed to send
    mapping(bytes32 => bool) allowedRemotes;

    // list of allowed remote chain ids (used for receiving messages)
    mapping(uint64 => bool) allowedChainIds;

    // list of allowed destination chain ids (handy for UX)
    mapping(uint64 chainId => bool enabled) private allowlistedChains;

    // error and modifier used when sending to remote chain
    error DestinationChainNotAllowlisted(uint64 destinationChainSelector);
    modifier onlyAllowlistedDestinationChain(uint64 destinationChainSelector) {
        if (!allowlistedChains[destinationChainSelector])
            revert DestinationChainNotAllowlisted(destinationChainSelector);
        _;
    }

    // checks to see if the contract sending a message from another network is allowed to send to this contract
    modifier onlyAllowlistedSourceChain(
        uint64 _sourceChainSelector,
        address _sender
    ) {
        require(
            allowedRemotes[
                keccak256(abi.encode(_sender, _sourceChainSelector))
            ],
            "Source Chain not allowed"
        );
        _;
    }

    constructor(address _router) CCIPReceiver(_router) {
        // set the chainlink CCIP router that relays messages
        router = IRouterClient(_router);
    }

    // logic called when this contract receives a message from another chain through the CCIP router
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    )
        internal
        override
        onlyAllowlistedSourceChain(
            any2EvmMessage.sourceChainSelector,
            abi.decode(any2EvmMessage.sender, (address))
        )
    {
        // decode the message data
        (address endUser, uint256 amount) = abi.decode(
            any2EvmMessage.data,
            (address, uint256)
        );

        // now we have that data from the other chain, we can do something with the encoded data here..
    }

    // sends a message through the chainlink CCIP router
    function sendMessage(
        uint64 _destinationChainSelector,
        address _receiver,
        uint256 _amount,
        address _destinationReceiverAddress
    )
        external
        payable
        onlyAllowlistedDestinationChain(_destinationChainSelector)
        returns (bytes32 messageId)
    {
        // build the CCIP message with our own method
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _destinationReceiverAddress == address(0)
                ? msg.sender
                : _destinationReceiverAddress,
            _amount,
            gasLimit
        );

        // Get the fee required to send the message across the chain
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

        // if the msg.value isn't more than the expected fee - revert
        if (fees > msg.value) {
            revert("Not enough for fees!");
        }

        // Send the message through the router and store the returned message ID
        messageId = router.ccipSend{value: fees}(
            _destinationChainSelector,
            evm2AnyMessage
        );

        // if these is left over eth as msg.value - send it back to the msg.sender
        if (msg.value > fees) {
            payable(msg.sender).transfer(msg.value - fees);
        }

        // Return the message ID (used for ccip block explorer and stuff)
        return messageId;
    }

    function _buildCCIPMessage(
        address _receiver,
        address _endUser,
        uint256 _amount,
        uint256 _gasLimit
    ) private pure returns (Client.EVM2AnyMessage memory) {
        return
            Client.EVM2AnyMessage({
                receiver: abi.encode(_receiver),
                data: abi.encode(_endUser, _amount), // this can be any arbitrary data
                tokenAmounts: new Client.EVMTokenAmount[](0),
                extraArgs: Client._argsToBytes(
                    Client.EVMExtraArgsV1({gasLimit: _gasLimit})
                ),
                feeToken: address(0) // means paying in native
            });
    }

    // handy function to get the fee required to send a message to a destination chain
    function getFee(
        address _receiver,
        address _recipientAddress,
        uint256 _amount,
        uint64 _destinationChainId
    ) external view returns (uint256) {
        Client.EVM2AnyMessage memory evm2AnyMessage = _buildCCIPMessage(
            _receiver,
            _recipientAddress,
            _amount,
            gasLimit
        );

        uint256 fees = router.getFee(_destinationChainId, evm2AnyMessage);

        return fees;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public pure override(AccessControl, CCIPReceiver) returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }

    // maintenance methods
    function updateAllowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        allowlistedChains[_destinationChainSelector] = allowed;
    }

    function updateAllowedRemotes(
        address _remoteAddress,
        uint64 _chainId,
        bool allowed
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        allowedRemotes[
            keccak256(abi.encode(_remoteAddress, _chainId))
        ] = allowed;
    }
}
