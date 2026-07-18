import { resolve } from "@bonfida/spl-name-service";
import type { Hono } from "hono";

import { toSnsDomain, toSolDomain } from "../utils/domain";
import {
  getConnection,
  handleApiError,
  response,
  type Env,
} from "../utils/http";
import { domainOrSubdomainWithoutTldSchema } from "../utils/schemas";

export const registerResolveRoutes = (app: Hono<Env>) => {
  app.get("/resolve/:domain", async (c) => {
    try {
      const domain = domainOrSubdomainWithoutTldSchema.parse(
        c.req.param("domain"),
      );
      const res = await resolve(getConnection(c), toSnsDomain(domain));
      return c.json(response(true, res));
    } catch (err) {
      return handleApiError(c, err);
    }
  });

  app.get("/resolveSns/:domain", async (c) => {
    try {
      const domain = domainOrSubdomainWithoutTldSchema.parse(
        c.req.param("domain"),
      );
      const res = await resolve(getConnection(c), toSnsDomain(domain));
      return c.json(response(true, res));
    } catch (err) {
      return handleApiError(c, err);
    }
  });

  app.get("/resolveSol/:domain", async (c) => {
    try {
      const domain = domainOrSubdomainWithoutTldSchema.parse(
        c.req.param("domain"),
      );
      const res = await resolve(getConnection(c), toSolDomain(domain));
      return c.json(response(true, res));
    } catch (err) {
      return handleApiError(c, err);
    }
  });
};
