import { Groth16Proof } from "snarkjs";
import { toFixedHex } from "./utils";
import { AbiCoder } from "ethers";

export function serializeG16Proof(proof:Groth16Proof): string {
  const abi = new AbiCoder();

  const nums = [
    toFixedHex(proof.pi_a[0]),
    toFixedHex(proof.pi_a[1]),
    toFixedHex(proof.pi_b[0][1]), // NOTE ENDIAN DIFFERENCES!
    toFixedHex(proof.pi_b[0][0]),
    toFixedHex(proof.pi_b[1][1]),
    toFixedHex(proof.pi_b[1][0]),
    toFixedHex(proof.pi_c[0]),
    toFixedHex(proof.pi_c[1]),
  ];

  const p = abi.encode(
    ["uint", "uint", "uint", "uint", "uint", "uint", "uint", "uint"],
    nums
  );

  return p;
}
