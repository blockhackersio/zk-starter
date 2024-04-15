import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Groth16VerifierModule = buildModule("Groth16VerifierModule", (m) => {
  const g16Verifier = m.contract("Groth16Verifier", []);

  return { g16Verifier };
});

export default buildModule("Protocol", (m) => {
  const { g16Verifier } = m.useModule(Groth16VerifierModule);
  const verifier = m.contract("Multiplier", [g16Verifier]);

  return { verifier };
});