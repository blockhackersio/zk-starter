// export your SDK here

import { Multiplier__factory } from "../typechain-types";
import { generateGroth16Proof } from "./zklib";

export class Multiplier {
  constructor(private address: string) {}

  async prove(a: number, b: number) {
    return await generateGroth16Proof({ a, b }, "multiplier");
  }

  async verify(proof: string, c: number) {
    const verifier = Multiplier__factory.connect(this.address);
    return await verifier.verify(proof, [c]);
  }
}
