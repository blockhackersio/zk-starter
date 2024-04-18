import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, ignition } from "hardhat";
import { expect } from "chai";
import { CircomExample } from "../src";
import CircomExampleModule from "../ignition/modules/CircomExample";

describe("test", () => {
  async function deployVerifierFixture() {
    return ignition.deploy(CircomExampleModule);
  }

  describe("circomExample", () => {
    it("should pass a valid proof", async () => {
      const { verifier } = await loadFixture(deployVerifierFixture);
      const address = await verifier.getAddress();
      const circomExample = new CircomExample(ethers.provider, address);
      const proof = await circomExample.multiplierProve(4, 11);
      await circomExample.multiplierVerify(proof, 44);
    });

    it("should fail an invalid proof", async () => {
      const { verifier } = await loadFixture(deployVerifierFixture);
      const address = await verifier.getAddress();
      const circomExample = new CircomExample(ethers.provider, address);
      const proof = await circomExample.multiplierProve(4, 10);
      await expect(circomExample.multiplierVerify(proof, 44)).to.be.revertedWith(
        "invalid proof"
      );
    });
  });
});
