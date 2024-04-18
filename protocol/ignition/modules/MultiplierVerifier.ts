import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MultiplierVerifier", (m) => {
  const verifier = m.contract("MultiplierVerifier", []);
  return { verifier };
});
