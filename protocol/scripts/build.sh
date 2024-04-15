#/usr/bin/env sh 

./scripts/compile_circuit.sh multiplier
pnpm hardhat compile
tsc && pnpm rollup -c rollup.config.mjs
