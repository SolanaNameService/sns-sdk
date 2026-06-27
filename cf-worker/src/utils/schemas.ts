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

export const publicKeySchema = z
  .string()
  .refine(isPubkey)
  .transform((value) => new PublicKey(value));

export const booleanSchema = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => value === true || value === "true");

const recordVersionSchema = z.union([
  z.literal(RecordVersion.V1),
  z.literal(RecordVersion.V2),
]);

export const ownerParamSchema = z.object({
  owner: publicKeySchema,
});

export const pubkeyParamSchema = z.object({
  pubkey: publicKeySchema,
});

export const domainRecordParamSchema = z.object({
  domain: z.string(),
  record: z.enum(Record),
});

export const recordsQuerySchema = z.object({
  records: z
    .string()
    .transform((value) => value.split(",").map((record) => record.trim()))
    .pipe(z.array(z.enum(Record)).min(1)),
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

export const registerQuerySchema = z
  .object({
    buyerStr: z.string().refine(isPubkey),
    domain: z.string(),
    space: z.coerce.number().min(0),
    serialize: booleanSchema.optional(),
    refKey: z.string().refine(isPubkey).optional(),
    mintStr: z.string().refine(isPubkey).optional(),
  })
  .transform(({ buyerStr, mintStr, refKey, domain, space, serialize }) => ({
    buyer: new PublicKey(buyerStr),
    domain,
    space,
    serialize,
    referrer: refKey ? new PublicKey(refKey) : undefined,
    mint: mintStr ? new PublicKey(mintStr) : undefined,
  }));

export const createSubdomainQuerySchema = z.object({
  owner: publicKeySchema,
  subdomain: z.string(),
  serialize: booleanSchema.optional(),
  finalOwner: publicKeySchema.optional(),
});
