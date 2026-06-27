import {
  createSubdomain,
  getDomainKeySync,
  NAME_PROGRAM_ID,
  registerDomain,
  transferInstruction,
} from "@bonfida/spl-name-service";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import type { TransactionInstruction } from "@solana/web3.js";
import type { Hono } from "hono";
import { z } from "zod";

import { toCanonicalSnsDomain } from "../utils/domain";
import { response, getConnection, type Env } from "../utils/http";
import { buildInstructionResponse } from "../utils/instructions";
import {
  createSubdomainQuerySchema,
  registerQuerySchema,
} from "../utils/schemas";

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const registerInstructionRoutes = (app: Hono<Env>) => {
  app.get("/register", async (c) => {
    try {
      const { buyerStr, domain, space, serialize, refKey, mintStr, rpc } =
        registerQuerySchema.parse(c.req.query());
      const buyer = new PublicKey(buyerStr);
      const mint = new PublicKey(mintStr || USDC_MINT);
      const ata = await getAssociatedTokenAddress(mint, buyer, true);
      const connection = getConnection(c, rpc);
      const ixs = await registerDomain(
        connection,
        toCanonicalSnsDomain(domain),
        space,
        buyer,
        ata,
        mint,
        refKey ? new PublicKey(refKey) : undefined,
      );
      const result = await buildInstructionResponse(
        connection,
        buyer,
        ixs,
        serialize,
      );

      return c.json(response(true, result));
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        return c.json(response(false, "Invalid input"), 400);
      }
      return c.json(response(false, "Internal error"), 500);
    }
  });

  app.get("/create-sub", async (c) => {
    try {
      const { owner, subdomain, rpc, serialize, finalOwner } =
        createSubdomainQuerySchema.parse(c.req.query());
      const connection = getConnection(c, rpc);
      const ixs: TransactionInstruction[] = [];
      const ownerKey = new PublicKey(owner);
      const fullSubdomain = toCanonicalSnsDomain(subdomain);
      const ix = await createSubdomain(connection, fullSubdomain, ownerKey, 0);
      ixs.push(...ix);

      if (finalOwner) {
        ixs.push(
          transferInstruction(
            NAME_PROGRAM_ID,
            getDomainKeySync(fullSubdomain).pubkey,
            new PublicKey(finalOwner),
            ownerKey,
          ),
        );
      }

      const result = await buildInstructionResponse(
        connection,
        ownerKey,
        ixs,
        serialize,
      );

      return c.json(response(true, result));
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        return c.json(response(false, "Invalid input"), 400);
      }
      return c.json(response(false, "Internal error"), 500);
    }
  });
};
