import { ErrorType } from "@bonfida/spl-name-service";
import { Connection } from "@solana/web3.js";
import type { Context } from "hono";

export type Env = {
  Bindings: {
    RPC_URL: string;
  };
};

export const getConnection = (c: Context<Env>, clientRpc?: string) => {
  const endpoint = clientRpc && clientRpc.trim() ? clientRpc : c.env.RPC_URL;
  return new Connection(endpoint, "processed");
};

export function response<T>(success: boolean, result: T) {
  return { s: success ? "ok" : "error", result };
}

export const deprecatedEndpoint = (replacement: string) =>
  response(false, `This endpoint is deprecated. Use ${replacement} instead.`);

export const isPrimaryDomainNotFoundError = (err: unknown) =>
  typeof err === "object" &&
  err !== null &&
  "type" in err &&
  err.type === ErrorType.PrimaryDomainNotFound;
