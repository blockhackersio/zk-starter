// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {MultiplierVerifier} from "./generated/multiplier.sol";

contract CircomExample {
    MultiplierVerifier public multiplier;

    constructor(address _multiplier) payable {
        multiplier = MultiplierVerifier(_multiplier);
    }

    function parseProof(
        bytes memory data
    )
        internal
        pure
        returns (uint[2] memory a, uint[2][2] memory b, uint[2] memory c)
    {
        (a[0], a[1], b[0][0], b[0][1], b[1][0], b[1][1], c[0], c[1]) = abi
            .decode(data, (uint, uint, uint, uint, uint, uint, uint, uint));
    }

    function multiplierVerify(bytes memory _proof, uint[1] memory _pubSignals) public view {
        (uint[2] memory a, uint[2][2] memory b, uint[2] memory c) = parseProof(
            _proof
        );
        require(multiplier.verifyProof(a, b, c, _pubSignals), "invalid proof");
    }
}
