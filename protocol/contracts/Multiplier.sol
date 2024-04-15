// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Groth16Verifier} from "./generated/multiplier.sol";

contract Multiplier {
    Groth16Verifier public verifier;

    constructor(address _verifier) payable {
        verifier = Groth16Verifier(_verifier);
    }

    function parseProof(
        bytes memory data
    )
        public
        pure
        returns (uint[2] memory a, uint[2][2] memory b, uint[2] memory c)
    {
        (a[0], a[1], b[0][0], b[0][1], b[1][0], b[1][1], c[0], c[1]) = abi
            .decode(data, (uint, uint, uint, uint, uint, uint, uint, uint));
    }

    function verify(bytes memory _proof, uint[1] memory _pubSignals) public view {
        (uint[2] memory a, uint[2][2] memory b, uint[2] memory c) = parseProof(
            _proof
        );
        require(verifier.verifyProof(a, b, c, _pubSignals), "invalid proof");
    }
}
