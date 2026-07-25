import {
  resolve,
  SNS_TLD,
  SOL_TLD,
  UnsupportedTldError,
} from "@bonfida/spl-name-service";
import type { Hono } from "hono";

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
      const domain = c.req.param("domain").trim().toLowerCase();
      const tld = [SNS_TLD, SOL_TLD].find((value) => domain.endsWith(value));

      if (!tld) {
        throw new UnsupportedTldError("Domain has an unsupported TLD suffix");
      }

      domainOrSubdomainWithoutTldSchema.parse(domain.slice(0, -tld.length));
      const res = await resolve(getConnection(c), domain);
      return c.json(response(true, res));
    } catch (err) {
      return handleApiError(c, err);
    }
  });
};
