import {
  findSubdomains,
  getDomainKeySync,
  getMultiplePrimaryDomains,
  getPrimaryDomain,
  getReverseKeySync,
  getSnsDomainsForOwner,
  getSnsNftsForOwner,
  reverseLookup,
  reverseLookupBatch,
} from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import type { Context, Hono } from "hono";
import { z } from "zod";

import { toSnsDomain } from "../utils/domain";
import {
  getConnection,
  isPrimaryDomainNotFoundError,
  response,
  type Env,
} from "../utils/http";
import { domainKeyQuerySchema } from "../utils/schemas";

const primaryDomainHandler = async (c: Context<Env>) => {
  try {
    const { owner } = c.req.param();
    const rpc = c.req.query("rpc");
    const connection = getConnection(c, rpc);
    const ownerKey = new PublicKey(owner);
    const res = await getPrimaryDomain(connection, ownerKey);
    return c.json(
      response(true, {
        domain: res.domain.toBase58(),
        reverse: res.reverse,
        stale: res.stale,
      }),
    );
  } catch (err) {
    console.log(err);
    if (isPrimaryDomainNotFoundError(err)) {
      return c.json(response(true, null));
    }
    return c.json(response(false, "Invalid domain input"));
  }
};

const multiplePrimaryDomainsHandler = async (c: Context<Env>) => {
  try {
    const { owners } = c.req.param();
    const rpc = c.req.query("rpc");
    const connection = getConnection(c, rpc);
    const ownerKeys = owners.split(",").map((owner: string) => new PublicKey(owner));
    const res = await getMultiplePrimaryDomains(connection, ownerKeys);
    return c.json(response(true, res));
  } catch (err) {
    console.log(err);
    if (isPrimaryDomainNotFoundError(err)) {
      return c.json(response(true, null));
    }
    return c.json(response(false, "Invalid domain input"));
  }
};

export const registerDomainRoutes = (app: Hono<Env>) => {
  app.get("/domain-key/:domain", (c) => {
    try {
      const { domain } = c.req.param();
      const { record } = domainKeyQuerySchema.parse(c.req.query());
      const res = getDomainKeySync(toSnsDomain(domain), record);
      return c.json(response(true, res.pubkey.toBase58()));
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        return c.json(response(false, "Invalid input"), 400);
      }
      return c.json(response(false, "Internal error"), 500);
    }
  });

  app.get("/domains/:owner", async (c) => {
    try {
      const { owner } = c.req.param();
      const rpc = c.req.query("rpc");
      const connection = getConnection(c, rpc);
      const ownerKey = new PublicKey(owner);
      const res = await getSnsDomainsForOwner(connection, ownerKey);
      const revs = await reverseLookupBatch(connection, res);
      const tokenized = await getSnsNftsForOwner(connection, ownerKey);

      return c.json(
        response(
          true,
          res
            .map((e, idx) => ({ key: e.toBase58(), domain: revs[idx] }))
            .concat(
              tokenized.map((e) => ({
                key: e.key.toBase58(),
                domain: e.reverse,
              })),
            ),
        ),
      );
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Invalid domain input"));
    }
  });

  app.get("/reverse-key/:domain", (c) => {
    try {
      const { domain } = c.req.param();
      const query = c.req.query("sub");
      const res = getReverseKeySync(toSnsDomain(domain), query === "true");
      return c.json(response(true, res.toBase58()));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Invalid domain input"));
    }
  });

  app.get("/primary-domain/:owner", primaryDomainHandler);
  app.get("/favorite-domain/:owner", primaryDomainHandler);
  app.get("/multiple-primary-domains/:owners", multiplePrimaryDomainsHandler);
  app.get("/multiple-favorite-domains/:owners", multiplePrimaryDomainsHandler);

  app.get("/reverse-lookup/:pubkey", async (c) => {
    try {
      const { pubkey } = c.req.param();
      const rpc = c.req.query("rpc");
      const res = await reverseLookup(getConnection(c, rpc), new PublicKey(pubkey));
      return c.json(response(true, res));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Invalid input"));
    }
  });

  app.get("/subdomains/:parent", async (c) => {
    try {
      const { parent } = c.req.param();
      const rpc = c.req.query("rpc");
      const subs = await findSubdomains(
        getConnection(c, rpc),
        getDomainKeySync(toSnsDomain(parent)).pubkey,
      );
      return c.json(response(true, subs));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Invalid input"));
    }
  });
};
