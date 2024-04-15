import localhost from "../ignition/deployments/chain-31337/deployed_addresses.json";

const ChainLookup = {
  localhost,
};

export type Network = keyof typeof ChainLookup;

// This utility type extracts keys but removes the 'Protocol#' prefix for convenience
type ProtocolKeys = {
  [K in keyof typeof localhost as K extends `Protocol#${infer Rest}`
  ? Rest
  : never]: (typeof localhost)[K];
};

export function getAddress<T extends Network, K extends keyof ProtocolKeys>(
  chain: T,
  name: K
): string {
  const key = `Protocol#${name}` as keyof (typeof ChainLookup)[T];
  return ChainLookup[chain][key] as string;
}
