
#/usr/bin/env sh 

./scripts/compile_circuit.sh multiplier
pnpm hardhat test ./test/Multiplier.ts
