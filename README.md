# zk-starter
### An Opinionated Zero Knowledge Starter Repository

This repository offers an integrated setup for developing and testing zero-knowledge proofs using a modern stack designed to streamline your development workflow. It combines the robust functionalities of Hardhat, Circom, and React to provide a cohesive environment for building and deploying smart contracts and zero-knowledge circuits in a production-like frontend interface.

## Key Features

- **Circom**: Empowers developers with tools for creating and managing zero-knowledge proofs efficiently.
- **Hardhat**: Utilized for deploying smart contracts, verifying proofs, and testing the contracts in a local development environment.
- **React Frontend**: A ready-to-use frontend setup to interact with your circuits and contracts, simulating real-world usage.

## Prerequisites

Before installation, ensure that you have the following software versions installed, as compatibility has been confirmed with:

- Circom v2.1.8
- Solidity Compiler (solc) v0.8.24
- Node.js v18
- pnpm v8.15.5

## Installation Guide

To set up the development environment, follow these steps:

Install all node dependencies which will also download the required powers of tau base file for zero-knowledge proof:

```bash
pnpm install
```

Note: The installation process involves downloading large files and may take some time.

## NixOS Setup

This repository comes with a nix flake for easy installation of dependencies.

Ensure direnv is installed and then run:

```
direnv allow
```

In order to get a shell for the folder with the correct dependencies installed.

## Basic Circuit

The repository demonstrates a basic [Multiplier circuit](protocol/circuits/multiplier.circom):

```circom
pragma circom 2.0.0;

template Multiplier() {
  signal input a;
  signal input b;
  signal output c;

  c <== a * b;
}

component main = Multiplier();
```

There is a basic [Multiplier](protocol/src/index.ts) prover created to form the base of your protocol sdk:

```ts
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
```


You can test the circuit using the [hardhat tests](protocol/test/Multiplier.ts) which allow for proving logic:

```ts
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
```


## Usage

This repository provides several scripts to help streamline the development and testing process:

| Script         | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| `pnpm build`   | Builds the circuits and smart contracts, preparing all necessary elements for testing. |
| `pnpm test`    | Runs tests for both the circuits and the smart contracts to ensure integrity.          |
| `pnpm dev`     | Executes a full build, spins up a Hardhat local node, deploys contracts, and launches<br/> the React frontend at [http://localhost:5173](http://localhost:5173). |

## Contributing

We welcome contributions from the community! If you'd like to improve the opinionated zero-knowledge starter repo, please feel free to fork the repository, make your changes, and submit a pull request. We appreciate your input!

Ensure you follow the provided coding standards and write tests for new features to maintain the quality of the software.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as you see fit.

By leveraging this starter repo, developers can focus more on the creative aspects of their projects while the configuration and setup are streamlined to provide a productive and error-free development environment.
