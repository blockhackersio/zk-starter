#!/usr/bin/env sh

FNAME=$1

if [ -z "$FNAME" ]; then
  echo "You must provide a circuit name"
  exit 1
fi

CIRCUIT=./circuits/$FNAME.circom

if [ ! -f "$CIRCUIT" ]; then
  echo "$CIRCUIT must exist."
  exit 1
fi

G16ZKEY=./compiled/${FNAME}.zkey
GENERATE_WITNESS=./compiled/${FNAME}_js/generate_witness.js
INPUT=./test/circuits/$FNAME.json
POT=./pot/pot.ptau
PROOF=./compiled/${FNAME}_proof.json
PUBLIC=./compiled/${FNAME}_public.json
R1CS=./compiled/$FNAME.r1cs
SOL_VERIFIER=./contracts/generated/${FNAME}.sol
VKEY=./compiled/${FNAME}_verification_key.json
WASM=./compiled/${FNAME}_js/$FNAME.wasm
WITNESS=./compiled/$FNAME.wtns
ZKEY=./compiled/${FNAME}.zkey

mkdir -p ./compiled
mkdir -p ./contracts/generated

echo ""
echo "Compile circuit..."
echo "=========================================="
circom $CIRCUIT --r1cs --wasm -o ./compiled

echo ""
echo "Generating g16 setup..."
echo "=========================================="
pnpm snarkjs groth16 setup $R1CS $POT $G16ZKEY

echo ""
echo "Export verifier..."
echo "=========================================="
pnpm snarkjs zkey export solidityverifier $G16ZKEY $SOL_VERIFIER

FNAME_CAPITALIZED=$(echo "$FNAME" | sed -e 's/[-_]\([a-z]\)/\u\1/g' -e 's/^\([a-z]\)/\u\1/')
sed -i "s/contract Groth16Verifier/contract ${FNAME_CAPITALIZED}Verifier/g" $SOL_VERIFIER

mkdir -p ignition/modules/generated
TARGET_FILE="./ignition/modules/generated/${FNAME_CAPITALIZED}Verifier.ts"

cat > "${TARGET_FILE}" <<EOF
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("${FNAME_CAPITALIZED}Verifier", (m) => {
  const verifier = m.contract("${FNAME_CAPITALIZED}Verifier", []);
  return { verifier };
});
EOF

echo "File written to ${TARGET_FILE}"
