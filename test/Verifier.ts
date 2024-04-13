import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { generateGroth16Proof } from "../src/zklib";
import { expect } from "chai";

describe("Verifier", () => {
  async function deployVerifierFixture() {
    const Groth16Verifier = await hre.ethers.getContractFactory(
      "Groth16Verifier"
    );
    const g16Verifier = await Groth16Verifier.deploy();
    const Verifier = await hre.ethers.getContractFactory("Verifier");
    const verifier = await Verifier.deploy(g16Verifier.target);

    return { verifier };
  }

  describe("Deployment", () => {
    it("should pass a valid proof", async () => {
      const { verifier } = await loadFixture(deployVerifierFixture);

      const proof = await generateGroth16Proof({ a: "4", b: "11" }, "hello");
      await verifier.verify(proof, ["44"]);
    });

    it("should fail an invalid proof", async () => {
      const { verifier } = await loadFixture(deployVerifierFixture);

      const proof = await generateGroth16Proof({ a: "4", b: "10" }, "hello");
      await expect(verifier.verify(proof, ["44"])).to.be.revertedWith(
        "invalid proof"
      );
    });
  });
});
