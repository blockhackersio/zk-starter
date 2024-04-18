# zk-starter
![Solidity](https://img.shields.io/badge/-Solidity-363636?style=flat-square&logo=solidity&logoColor=white)
![Circom](https://img.shields.io/badge/-Circom-AA4F8B?style=flat-square&logo=circom&logoColor=white)
![React](https://img.shields.io/badge/-React-4499cc?style=flat-square&logo=react&logoColor=white)

### An Opinionated Zero Knowledge Starter Repository for Circom, Solidity and React

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
  const [proof, setProof] = useState<string>("");
  const [provingTime, setProvingTime] = useState<number | undefined>();
  const [verifyingTime, setVerifyingTime] = useState<number | undefined>();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    setStatus("init");
    setProof("");
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const a = Number(data.get("a"));
    const b = Number(data.get("b"));
    const c = Number(data.get("c"));
    let time = new Date();
    const proof = await example.multiplierProve(a, b);
    setProvingTime(Number(new Date()) - Number(time));
    setProof(proof);
    time = new Date();
    try {
      await example.multiplierVerify(proof, c);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
    setVerifyingTime(Number(new Date()) - Number(time));
  }

  return (
    <div>
      <h2>Prove and Verify your zkSNARK</h2>
      <blockquote>a x b = c</blockquote>
      <form onSubmit={onSubmit}>
        <label htmlFor="a">
          a:
          <input type="number" name="a" />
        </label>
        <label>
          b:
          <input type="number" name="b" />
        </label>
        <label>
          c:
          <input type="number" name="c" />
        </label>
        {status === "init" && <button>Prove and verify</button>}
        {status === "error" && (
          <button>
            Try Again <span className="error">×</span>
          </button>
        )}
        {status === "success" && (
          <button>
            Proof is valid <span className="success">✓</span>
          </button>
        )}
        {provingTime !== undefined && <div>Proof took {provingTime}ms</div>}
        {verifyingTime !== undefined && (
          <div>Verification took {verifyingTime}ms</div>
        )}
      </form>
      {proof && <pre>{proof}</pre>}
    </div>
  );
}
```

![image](https://github.com/blockhackersio/zk-starter/assets/1256409/0bdd2c1d-5dd3-40ad-adbf-bcc7ca87788d)


## Usage

This repository provides several scripts to help streamline the development and testing process:

| Script         | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| `pnpm build`   | Builds the circuits and smart contracts, preparing all necessary elements for testing. |
| `pnpm test`    | Runs tests for both the circuits and the smart contracts to ensure integrity.          |
| `pnpm dev`     | Executes a full build, spins up a Hardhat local node, deploys contracts, and launches<br/> the React frontend at [http://localhost:5173](http://localhost:5173). |


## Adding a New Circuit

To integrate a new circuit into your project, follow these steps:

1. **Create a New Circuit File:**
   - Initialize a new circuit by creating a `.circom` file at `./circuits/new_circuit.circom`.

2. **Build the Project:**
   - Run `pnpm build` to compile the new circuit. This process generates the following files:
     - `./compiled/new_circuit_js/**`
     - `./compiled/new_circuit.r1cs`
     - `./compiled/new_circuit.zkey`
     - `./contracts/generated/new_circuit.sol`
     - `./ignition/modules/generated/NewCircuitVerifier.ts`
     - Typechain types for `new_circuit.sol`

3. **Modify the Smart Contract:**
   - Update the `CircomExample.sol` contract to include the new verifier contract. Example changes:
     ```diff
     import {MultiplierVerifier} from "./generated/multiplier.sol";
     +import {NewCircuitVerifier} from "./generated/new_circuit.sol";
     ```
   - Utilize the new verifier similarly to existing circuits.

4. **Integrate with Ignite Module:**
   - An Ignite module `NewCircuitVerifier.ts` will be automatically created. Use it as shown:
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

5. **Update Application Logic:**
   - Adjust your application code to utilize the new circuit. For example, in `./src/index.ts`:
     ```ts
     await generateGroth16Proof({ a, b }, "new_circuit");
     ```

6. **Revise Frontend As Necessary:**
   - Make any required updates to the frontend, especially if the API or interaction patterns have changed due to the new circuit.

## Contributing

We welcome contributions from the community! If you'd like to improve the opinionated zero-knowledge starter repo, please feel free to fork the repository, make your changes, and submit a pull request. We appreciate your input!

Ensure you follow the provided coding standards and write tests for new features to maintain the quality of the software.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as you see fit.

By leveraging this starter repo, developers can focus more on the creative aspects of their projects while the configuration and setup are streamlined to provide a productive and error-free development environment.
