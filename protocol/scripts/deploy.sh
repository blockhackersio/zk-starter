#/usr/bin/env sh

NETWORK=${1:-localhost}

pnpm build
pnpm hardhat ignition deploy ./ignition/modules/Protocol.ts --network $NETWORK
