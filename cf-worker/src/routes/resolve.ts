import { resolve } from "@bonfida/spl-name-service";
import type { Hono } from "hono";

import { toSnsDomain, toSolDomain } from "../utils/domain";
import { getConnection, response, type Env } from "../utils/http";

export const registerResolveRoutes = (app: Hono<Env>) => {
  app.get("/resolve/:domain", async (c) => {
    const { domain } = c.req.param();
    const rpc = c.req.query("rpc");
    try {
      const res = await resolve(getConnection(c, rpc), toSnsDomain(domain));
      return c.json(response(true, res));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Domain not found"));
    }
  });

  app.get("/resolveSns/:domain", async (c) => {
    const { domain } = c.req.param();
    const rpc = c.req.query("rpc");
    try {
      const res = await resolve(getConnection(c, rpc), toSnsDomain(domain));
      return c.json(response(true, res));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Domain not found"));
    }
  });

  app.get("/resolveSol/:domain", async (c) => {
    const { domain } = c.req.param();
    const rpc = c.req.query("rpc");
    try {
      const res = await resolve(getConnection(c, rpc), toSolDomain(domain));
      return c.json(response(true, res));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Domain not found"));
    }
  });
};
