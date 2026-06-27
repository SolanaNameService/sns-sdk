import {
  getHandleAndRegistryKey,
  getTwitterRegistry,
} from "@bonfida/spl-name-service";
import type { Hono } from "hono";
import { z } from "zod";

import { getConnection, response, type Env } from "../utils/http";
import { pubkeyParamSchema } from "../utils/schemas";

export const registerTwitterRoutes = (app: Hono<Env>) => {
  app.get("/twitter/get-handle-by-key/:key", async (c) => {
    try {
      const { pubkey: key } = pubkeyParamSchema.parse({
        pubkey: c.req.param("key"),
      });
      const [handle] = await getHandleAndRegistryKey(getConnection(c), key);
      return c.json(response(true, handle));
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        return c.json(response(false, "Invalid input"), 400);
      }
      return c.json(response(false, "Internal error"), 500);
    }
  });

  app.get("/twitter/get-key-by-handle/:handle", async (c) => {
    try {
      const { handle } = c.req.param();
      const registry = await getTwitterRegistry(getConnection(c), handle);
      return c.json(response(true, registry.owner.toBase58()));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Internal error"), 500);
    }
  });
};
