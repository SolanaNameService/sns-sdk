import { createSubdomain, registerDomain } from "@bonfida/spl-name-service";
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

const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

export const registerInstructionRoutes = (app: Hono<Env>) => {
  app.get("/register", async (c) => {
    try {
      const { buyer, domain, space, serialize, referrer, mint } =
        registerQuerySchema.parse(c.req.query());
      const paymentMint = mint ?? USDC_MINT;
      const ata = await getAssociatedTokenAddress(paymentMint, buyer, true);
      const connection = getConnection(c);
      const ixs = await registerDomain(
        toCanonicalSnsDomain(domain),
        space,
        buyer,
        ata,
        paymentMint,
        referrer,
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

  app.get("/create-subdomain", async (c) => {
    try {
      const { owner, subdomain, serialize } = createSubdomainQuerySchema.parse(
        c.req.query(),
      );
      const connection = getConnection(c);
      const ixs: TransactionInstruction[] = [];
      const fullSubdomain = toCanonicalSnsDomain(subdomain);
      const ix = await createSubdomain(connection, fullSubdomain, owner, 0);
      ixs.push(...ix);

      const result = await buildInstructionResponse(
        connection,
        owner,
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
