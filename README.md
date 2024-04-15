# An Opinionated Zero Knowledge Starter Repository

This repository offers an integrated setup for developing and testing zero-knowledge proofs using a modern stack designed to streamline your development workflow. It combines the robust functionalities of Hardhat, Circom, and React to provide a cohesive environment for building and deploying smart contracts and zero-knowledge circuits in a production-like frontend interface.

## Key Features

- **Hardhat**: Utilized for deploying smart contracts, verifying proofs, and testing the contracts in a local development environment.
- **Circom**: Empowers developers with tools for creating and managing zero-knowledge proofs efficiently.
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

## Usage

This repository provides several scripts to help streamline the development and testing process:

| Script         | Description                                                                            |
| -------------- | -------------------------------------------------------------------------------------- |
| `pnpm build`   | Builds the circuits and smart contracts, preparing all necessary elements for testing. |
| `pnpm test`    | Runs tests for both the circuits and the smart contracts to ensure integrity.          |
| `pnpm dev`     | Executes a full build, spins up a Hardhat local node, deploys contracts, and launches the React frontend at [http://localhost:5173](http://localhost:5173). |

## Contributing

We welcome contributions from the community! If you'd like to improve the opinionated zero-knowledge starter repo, please feel free to fork the repository, make your changes, and submit a pull request. We appreciate your input!

Ensure you follow the provided coding standards and write tests for new features to maintain the quality of the software.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as you see fit.

By leveraging this starter repo, developers can focus more on the creative aspects of their projects while the configuration and setup are streamlined to provide a productive and error-free development environment.
