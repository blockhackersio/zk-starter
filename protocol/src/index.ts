// export your SDK here

import { Provider } from "ethers";
import { CircomExample__factory } from "../typechain-types";
import { generateGroth16Proof } from "./zklib";
export * from "./config";

export class CircomExample {
  constructor(
    private provider: Provider,
    private address: string 
  ) { }

  async multiplierProve(a: number, b: number) {
    return await generateGroth16Proof({ a, b }, "multiplier");
  }

  async multiplierVerify(proof: string, c: number) {
    const verifier = CircomExample__factory.connect(this.address, this.provider);
    return await verifier.multiplierVerify(proof, [c]);
  }
}
