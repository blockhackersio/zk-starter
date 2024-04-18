#/usr/bin/env sh

NETWORK=${1:-localhost}

pnpm build
pnpm hardhat ignition deploy ./ignition/modules/CircomExample.ts --network $NETWORK
./scripts/archive_deployment.sh
