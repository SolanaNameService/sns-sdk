import { Record } from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import { z } from "zod";

const MAX_BATCH_SIZE = 100;
const MAX_DOMAIN_SPACE = 10_000;

export const isPubkey = (x: string) => {
  try {
    new PublicKey(x);
    return true;
  } catch {
    return false;
  }
};

const isIpLiteral = (host: string) => {
  const h = host.toLowerCase();
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return true;
  if (h.includes(":")) return true;
  return false;
};

export const rpcSchema = z
  .string()
  .trim()
  .refine((value) => {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      return false;
    }
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    return (
      url.protocol === "https:" &&
      !isIpLiteral(host) &&
      host !== "localhost" &&
      !host.endsWith(".localhost")
    );
  }, "rpc must be an https URL with a non-numeric host");

export const publicKeySchema = z
  .string()
  .refine(isPubkey)
  .transform((value) => new PublicKey(value));

export const booleanSchema = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => value === true || value === "true");

export const publicKeysCsvSchema = z
  .string()
  .transform((value) => value.split(",").map((key) => key.trim()))
  .pipe(z.array(publicKeySchema).min(1).max(MAX_BATCH_SIZE));

export const recordsQuerySchema = z.object({
  records: z
    .string()
    .transform((value) => value.split(",").map((record) => record.trim()))
    .pipe(z.array(z.enum(Record)).min(1).max(MAX_BATCH_SIZE)),
});

export const domainWithoutTldSchema = (
  allowedLabelLengths: readonly number[],
) =>
  z
    .string()
    .trim()
    .toLowerCase()
    .refine((domain) => {
      const labels = domain.split(".");
      return (
        allowedLabelLengths.includes(labels.length) &&
        labels.every((label) => label.length > 0)
      );
    });

export const topLevelDomainWithoutTldSchema = domainWithoutTldSchema([1]);

export const subdomainWithoutTldSchema = domainWithoutTldSchema([2]);

export const domainOrSubdomainWithoutTldSchema = domainWithoutTldSchema([
  1, 2,
]);

export const domainRecordParamSchema = z.object({
  domain: domainOrSubdomainWithoutTldSchema,
  record: z.enum(Record),
});

export const registerQuerySchema = z.object({
  buyer: publicKeySchema,
  domain: topLevelDomainWithoutTldSchema,
  space: z.coerce.number().int().min(0).max(MAX_DOMAIN_SPACE),
  serialize: booleanSchema.optional(),
  referrer: publicKeySchema.optional(),
  mint: publicKeySchema.optional(),
});

export const createSubdomainQuerySchema = z.object({
  owner: publicKeySchema,
  subdomain: subdomainWithoutTldSchema,
  serialize: booleanSchema.optional(),
});
