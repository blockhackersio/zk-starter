#!/usr/bin/env sh

source ./scripts/_paths.sh

echo ""
echo "Compile circuit..."
echo "=========================================="
circom $CIRCUIT --r1cs --wasm -o ./compiled

echo ""
echo "Generating g16 setup..."
echo "=========================================="
pnpm snarkjs groth16 setup $R1CS $POT $G16ZKEY

echo ""
echo "Export plonk verifier..."
echo "=========================================="
pnpm snarkjs zkey export solidityverifier $G16ZKEY $SOL_VERIFIER
