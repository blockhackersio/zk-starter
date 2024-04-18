import { CircuitSignals, groth16 } from "snarkjs";
import { getWasmFileLocation, getZkeyFileLocation } from "./key_locator";
import { serializeG16Proof } from "./serialize_proof";

export async function generateGroth16Proof(
  inputs: CircuitSignals,
  circuitName: string = "hello"
) {
  const wasmLocation = getWasmFileLocation(circuitName);
  const zkeyLocation = getZkeyFileLocation(circuitName);

  const { proof } = await groth16.fullProve(inputs, wasmLocation, zkeyLocation);
  return serializeG16Proof(proof);
}

export type GenerateProofFn = (
  inputs: object,
  circuitName?: string
) => Promise<string>;
