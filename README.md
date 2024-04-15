# An opinionated zero knowledge starter repo

- **Hardhat** to deploy smart contracts verify proofs and test the contracts
- **Circom** for Zero Knowledge Proving
- **React Frontend** to test the circuits manually in a production like environment.

## Installation

Ensure the prerequisites are installed. This repo has been tested with the following:

- circom v2.1.8
- solc v0.8.24
- node v18
- pnpm 8.15.5

Install node dependencies:

```
pnpm install
```

Note this will download the powers of tau base file.

This may take time. 

## Scripts

| Script  | Description                      |
| ------- | -------------------------------- |
| `pnpm build` | Build the circuits and contracts |
| `pnpm test`  | Test the circuits and contracts  |
| `pnpm dev`  | Build the circuits run a hardhat node and deploy to the hardhat node and run the frontend on http://localhost:5173  | 
