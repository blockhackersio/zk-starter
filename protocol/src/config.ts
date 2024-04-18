import deployments from "../deployments.json";

type DeploymentJson = typeof deployments;

export type Network = keyof DeploymentJson;

export function getAddress<T extends Network, K extends keyof DeploymentJson[T]>(
  chain: T,
  name: K
): string {
  return deployments[chain][name] as string;
}
