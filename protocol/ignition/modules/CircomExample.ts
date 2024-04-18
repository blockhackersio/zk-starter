import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MultiplierVerifier from "./MultiplierVerifier";

export default buildModule("CircomExample", (m) => {
  const { verifier: multiplierVerifier } = m.useModule(MultiplierVerifier);
  const verifier = m.contract("CircomExample", [multiplierVerifier]);

  return { verifier };
});
