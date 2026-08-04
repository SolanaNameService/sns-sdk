import { ErrorType } from "@bonfida/spl-name-service";
import { Connection, SolanaJSONRPCError } from "@solana/web3.js";
import type { Context } from "hono";
import { z } from "zod";

import type { TokenizerCache } from "../tokenizer-cache";
import { rpcSchema } from "./schemas";

export type Env = {
  Bindings: {
    RPC_URL: string;
    CACHE_TTL_SECONDS?: string;
    TOKENIZER_CACHE: DurableObjectNamespace<TokenizerCache>;
  };
};

export const getConnection = (c: Context<Env>) => {
  const clientRpc = c.req.query("rpc")?.trim();
  if (clientRpc) {
    rpcSchema.parse(clientRpc);
  }
  const endpoint = clientRpc || c.env.RPC_URL?.trim();

  if (!endpoint) {
    throw new Error("RPC_URL is not configured");
  }

  return new Connection(endpoint, "processed");
};

export function response<T>(success: boolean, result: T) {
  return { s: success ? "ok" : "error", result };
}

export const deprecatedEndpoint = (replacement: string) =>
  response(false, `This endpoint is deprecated. Use ${replacement} instead.`);

type ErrorResource = "Domain" | "Record" | "Account";

type HandleApiErrorOptions = {
  resource?: ErrorResource;
  primaryDomainNotFoundAsNull?: boolean;
};

const getSnsErrorType = (err: unknown) => {
  if (typeof err !== "object" || err === null || !("type" in err)) {
    return undefined;
  }

  return err.type as ErrorType;
};

export const handleApiError = (
  c: Context<Env>,
  err: unknown,
  options: HandleApiErrorOptions = {},
) => {
  console.log(err);

  if (err instanceof z.ZodError) {
    return c.json(response(false, "Invalid input"), 400);
  }

  if (
    err instanceof Error &&
    err.message === "Record header account not found"
  ) {
    return c.json(response(false, "Record not found"), 404);
  }

  const errorType = getSnsErrorType(err);

  if (
    options.primaryDomainNotFoundAsNull &&
    errorType === ErrorType.PrimaryDomainNotFound
  ) {
    return c.json(response(true, null));
  }

  switch (errorType) {
    case ErrorType.InvalidDomain:
    case ErrorType.InvalidSubdomain:
    case ErrorType.InvalidParent:
    case ErrorType.InvalidInput:
    case ErrorType.PythFeedNotFound:
      return c.json(response(false, "Invalid input"), 400);
    case ErrorType.UnsupportedTld:
      return c.json(response(false, "Unsupported TLD"), 400);
    case ErrorType.DomainDoesNotExist:
      return c.json(response(false, "Domain not found"), 404);
    case ErrorType.DomainExpired:
      return c.json(response(false, "Domain expired"), 410);
    case ErrorType.SnsSolResolutionMismatch:
      return c.json(response(false, "SRS and SNS resolution mismatch"), 409);
    case ErrorType.AccountDoesNotExist:
    case ErrorType.NoAccountData:
    case ErrorType.NftRecordNotFound:
      return c.json(
        response(false, `${options.resource ?? "Resource"} not found`),
        404,
      );
    case ErrorType.InvalidRecordData:
    case ErrorType.RecordMalformed:
    case ErrorType.WrongValidation:
    case ErrorType.InvalidRoa:
      return c.json(response(false, "Record is malformed"), 422);
  }

  if (err instanceof SolanaJSONRPCError) {
    return c.json(response(false, "RPC unavailable"), 502);
  }

  return c.json(response(false, "Internal error"), 500);
};
