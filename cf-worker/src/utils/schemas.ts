import { Record, RecordVersion } from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import { z } from "zod";

export const isPubkey = (x: string) => {
  try {
    new PublicKey(x);
    return true;
  } catch {
    return false;
  }
};

export const booleanSchema = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => value === true || value === "true");

const recordVersionSchema = z.union([
  z.literal(RecordVersion.V1),
  z.literal(RecordVersion.V2),
]);

export const rpcQuerySchema = z.object({
  rpc: z.string().optional(),
});

export const domainParamSchema = z.object({
  domain: z.string(),
});

export const domainRecordParamSchema = z.object({
  domain: z.string(),
  record: z.enum(Record),
});

export const domainKeyQuerySchema = z.object({
  record: z
    .preprocess((value) => {
      if (value === undefined) return undefined;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }, recordVersionSchema)
    .optional(),
});

export const registerQuerySchema = z.object({
  buyerStr: z.string().refine(isPubkey),
  domain: z.string(),
  space: z.coerce.number().min(0),
  serialize: booleanSchema.optional(),
  refKey: z.string().refine(isPubkey).optional(),
  mintStr: z.string().refine(isPubkey).optional(),
  rpc: z.string().optional(),
});

export const createSubdomainQuerySchema = z.object({
  owner: z.string().refine(isPubkey),
  subdomain: z.string(),
  rpc: z.string().optional(),
  serialize: booleanSchema.optional(),
  finalOwner: z.string().refine(isPubkey).optional(),
});
