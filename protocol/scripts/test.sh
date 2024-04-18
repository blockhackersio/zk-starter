
#/usr/bin/env sh 

for file in ./circuits/*; do
  circuit_file=$(basename "$file")
  circuit_name=${circuit_file%.*}
  ./scripts/compile_circuit.sh "$circuit_name"
done
pnpm hardhat test ./test/circom_tests.ts
