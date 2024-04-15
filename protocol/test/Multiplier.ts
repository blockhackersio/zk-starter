import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, ignition } from "hardhat";
import { expect } from "chai";
import { Multiplier } from "../src";
import ProtocolModule from "../ignition/modules/Protocol";

describe("Multiplier", () => {
  async function deployVerifierFixture() {
    return ignition.deploy(ProtocolModule);
  }

  describe("Deployment", () => {
    it("should pass a valid proof", async () => {
      const { verifier } = await loadFixture(deployVerifierFixture);
      const address = await verifier.getAddress();
      const multiplier = new Multiplier(ethers.provider, address);
      const proof = await multiplier.prove(4, 11);
      await multiplier.verify(proof, 44);
    });

    it("should fail an invalid proof", async () => {
      const { verifier } = await loadFixture(deployVerifierFixture);
      const address = await verifier.getAddress();
      const multiplier = new Multiplier(ethers.provider, address);
      const proof = await multiplier.prove(4, 10);
      await expect(multiplier.verify(proof, 44)).to.be.revertedWith(
        "invalid proof"
      );
    });
  });
});