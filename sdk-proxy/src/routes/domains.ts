import {
  findSubdomains,
  getSnsDomainKeySync,
  getMultiplePrimaryDomains,
  getPrimaryDomain,
  getReverseKeySync,
  getSnsDomainsForOwner,
  getSnsNftsForOwner,
  NameRegistryState,
  reverseLookup,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "@bonfida/spl-name-service";
import type { Context, Hono } from "hono";

import {
  getConnection,
  handleApiError,
  response,
  type Env,
} from "../utils/http";
import {
  domainOrSubdomainWithoutTldSchema,
  publicKeySchema,
  publicKeysCsvSchema,
  topLevelDomainWithoutTldSchema,
} from "../utils/schemas";

const primaryDomainHandler = async (c: Context<Env>) => {
  try {
    const owner = publicKeySchema.parse(c.req.param("owner"));
    const connection = getConnection(c);
    const res = await getPrimaryDomain(connection, owner);
    return c.json(
      response(true, {
        domain: res.domain.toBase58(),
        reverse: res.reverse,
        stale: res.stale,
      }),
    );
  } catch (err) {
    return handleApiError(c, err, { primaryDomainNotFoundAsNull: true });
  }
};

const multiplePrimaryDomainsHandler = async (c: Context<Env>) => {
  try {
    const ownerKeys = publicKeysCsvSchema.parse(c.req.param("owners"));
    const connection = getConnection(c);
    const res = await getMultiplePrimaryDomains(connection, ownerKeys);
    return c.json(response(true, res));
  } catch (err) {
    return handleApiError(c, err, { primaryDomainNotFoundAsNull: true });
  }
};

export const registerDomainRoutes = (app: Hono<Env>) => {
  app.get("/domain-key/:domain", (c) => {
    try {
      const domain = domainOrSubdomainWithoutTldSchema.parse(
        c.req.param("domain"),
      );

      const res = getSnsDomainKeySync(domain);
      return c.json(response(true, res.pubkey.toBase58()));
    } catch (err) {
      return handleApiError(c, err);
    }
  });

  app.get("/domains/:owner", async (c) => {
    try {
      const owner = publicKeySchema.parse(c.req.param("owner"));
      const connection = getConnection(c);
      const [domains, nfts] = await Promise.all([
        getSnsDomainsForOwner(connection, owner),
        getSnsNftsForOwner(connection, owner),
      ]);

      return c.json(
        response(
          true,
          domains.concat(nfts).map((entry) => ({
            domain: entry.domain,
            key: entry.key.toBase58(),
          })),
        ),
      );
    } catch (err) {
      return handleApiError(c, err);
    }
  });

  app.get("/primary-domain/:owner", primaryDomainHandler);
  app.get("/favorite-domain/:owner", primaryDomainHandler);
  app.get("/multiple-primary-domains/:owners", multiplePrimaryDomainsHandler);
  app.get("/multiple-favorite-domains/:owners", multiplePrimaryDomainsHandler);

  app.get("/reverse-key/:domain", (c) => {
    try {
      const domain = domainOrSubdomainWithoutTldSchema.parse(
        c.req.param("domain"),
      );
      const labels = domain.split(".");
      const isSubdomain = labels.length === 2;
      const res = getReverseKeySync(domain, isSubdomain);
      return c.json(response(true, res.toBase58()));
    } catch (err) {
      return handleApiError(c, err);
    }
  });

  app.get("/reverse-lookup/:pubkey", async (c) => {
    try {
      const pubkey = publicKeySchema.parse(c.req.param("pubkey"));
      const connection = getConnection(c);
      const { registry } = await NameRegistryState.retrieve(connection, pubkey);
      const parent = registry.parentName.equals(SNS_ROOT_DOMAIN_ACCOUNT)
        ? undefined
        : registry.parentName;
      const res = await reverseLookup(connection, pubkey, parent);
      return c.json(response(true, res));
    } catch (err) {
      return handleApiError(c, err, { resource: "Account" });
    }
  });

  app.get("/subdomains/:parent", async (c) => {
    try {
      const parent = topLevelDomainWithoutTldSchema.parse(
        c.req.param("parent"),
      );
      const subs = await findSubdomains(
        getConnection(c),
        getSnsDomainKeySync(parent).pubkey,
      );
      return c.json(response(true, subs));
    } catch (err) {
      return handleApiError(c, err);
    }
  });
};
