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

There is a basic [Prover](protocol/src/index.ts) created to form the base of your protocol sdk:

```ts
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
```


You can test the circuit using the [Hardhat Tests](protocol/test/circom_tests.ts) which allow for testing integration logic with the prover:

```ts
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
```

Lastly you can edit the [Frontend React Application](frontend/src/App.tsx) to create real experiences for users:

```tsx
function App() {
  const [status, setStatus] = useState<"init" | "error" | "success">("init");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    setStatus("init");
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const a = Number(data.get("a"));
    const b = Number(data.get("b"));
    const c = Number(data.get("c"));
    console.log({ a, b, c });
    const example = new CircomExample(
      provider,
      getAddress("chain-31337", "CircomExample")
    );
    const proof = await example.multiplierProve(a, b);
    try {
      await example.multiplierVerify(proof, c);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <label>a: </label>
        <input name="a" />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <label>b: </label>
        <input name="b" />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <label>c: </label>
        <input name="c" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button>Prove and verify</button>
        {status === "error" && <div style={{ color: "red" }}>×</div>}
        {status === "success" && <div style={{ color: "green" }}>✓</div>}
      </div>
    </form>
  );
}
```



## Usage

This repository provides several scripts to help streamline the development and testing process:

| Script         | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| `pnpm build`   | Builds the circuits and smart contracts, preparing all necessary elements for testing. |
| `pnpm test`    | Runs tests for both the circuits and the smart contracts to ensure integrity.          |
| `pnpm dev`     | Executes a full build, spins up a Hardhat local node, deploys contracts, and launches<br/> the React frontend at [http://localhost:5173](http://localhost:5173). |


## Adding new circuit

To add a new circuit you need to do the following:

1. create a new circom file `./circuits/new_circuit.circom`
2. Build the project with `pnpm build` this will create the following files:
   - `./compiled/new_circuit_js/**`
   - `./compiled/new_circuit.r1cs`
   - `./compiled/new_circuit.zkey`
   - `./contracts/generated/new_circuit.sol`
   - `./ignition/modules/generated/NewCircuitVerifier.ts`
   - Typechain types for the new_circuit.sol contract
4. Adjust the `CircomExample.sol` contract to include the new generated verifier contract for example:
    ```diff
    import {MultiplierVerifier} from "./generated/multiplier.sol";
    +import {NewCircuitVerifier} from "./generated/new_circuit.sol";
    ```
    And use it in a similar way to the other circuit.
5. There should be an ignite module created for you at `./ignite/modules/NewCurcuitVerifier.ts` you can use it in a similar way to the example:
    ```diff
    import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
    import MultiplierVerifier from "./generated/MultiplierVerifier";
    +import NewCircuitVerifier from "./generated/NewCircuitVerifier";

    export default buildModule("CircomExample", (m) => {
      const { verifier: multiplierVerifier } = m.useModule(MultiplierVerifier);
    +  const { verifier: newCircuitVerifier } = m.useModule(NewCircuitVerifier);
      // etc...
    });
    ```
6. Update the way you use the zklib functions to use the new circuit in `./src/index.ts`:
    ```ts
    await generateGroth16Proof({ a, b }, "new_circuit");
    ```
7. Now update your frontend if necessary depending on the API changes you made


## Contributing

We welcome contributions from the community! If you'd like to improve the opinionated zero-knowledge starter repo, please feel free to fork the repository, make your changes, and submit a pull request. We appreciate your input!

Ensure you follow the provided coding standards and write tests for new features to maintain the quality of the software.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as you see fit.

By leveraging this starter repo, developers can focus more on the creative aspects of their projects while the configuration and setup are streamlined to provide a productive and error-free development environment.
