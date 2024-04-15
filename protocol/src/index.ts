// export your SDK here

import { Provider } from "ethers";
import { Multiplier__factory } from "../typechain-types";
import { generateGroth16Proof } from "./zklib";
export * from "./config";

export class Multiplier {
  constructor(
    private provider: Provider,
    private address: string 
  ) { }

  async prove(a: number, b: number) {
    return await generateGroth16Proof({ a, b }, "multiplier");
  }

  async verify(proof: string, c: number) {
    const verifier = Multiplier__factory.connect(this.address, this.provider);
    return await verifier.verify(proof, [c]);
  }
}
