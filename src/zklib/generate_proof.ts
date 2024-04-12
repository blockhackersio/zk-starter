import { CircuitSignals, groth16 } from "snarkjs";
import { getWasmFileLocation, getZkeyFileLocation } from "./key_locator";
import { toFixedHex } from "./utils";
import { AbiCoder } from "ethers";

export async function generateGroth16Proof(
  inputs: CircuitSignals,
  circuitName: string = "hello"
) {
  const wasmLocation = getWasmFileLocation(circuitName);
  const zkeyLocation = getZkeyFileLocation(circuitName);

  const { proof } = await groth16.fullProve(inputs, wasmLocation, zkeyLocation);
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

export type GenerateProofFn = (
  inputs: object,
  circuitName?: string
) => Promise<string>;
