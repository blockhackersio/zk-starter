import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Groth16VerifierModule = buildModule("Groth16VerifierModule", (m) => {
  const g16Verifier = m.contract("Groth16Verifier", []);

  return { g16Verifier };
});

export default buildModule("CircomExample", (m) => {
  const { g16Verifier } = m.useModule(Groth16VerifierModule);
  const verifier = m.contract("CircomExample", [g16Verifier]);

  return { verifier };
});
