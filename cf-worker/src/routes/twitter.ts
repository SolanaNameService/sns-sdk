import {
  getHandleAndRegistryKey,
  getTwitterRegistry,
} from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import type { Hono } from "hono";

import { getConnection, response, type Env } from "../utils/http";

export const registerTwitterRoutes = (app: Hono<Env>) => {
  app.get("/twitter/get-handle-by-key/:key", async (c) => {
    try {
      const { key } = c.req.param();
      const rpc = c.req.query("rpc");
      const [handle] = await getHandleAndRegistryKey(
        getConnection(c, rpc),
        new PublicKey(key),
      );
      return c.json(response(true, handle));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Invalid input"));
    }
  });

  app.get("/twitter/get-key-by-handle/:handle", async (c) => {
    try {
      const { handle } = c.req.param();
      const rpc = c.req.query("rpc");
      const registry = await getTwitterRegistry(getConnection(c, rpc), handle);
      return c.json(response(true, registry.owner.toBase58()));
    } catch (err) {
      console.log(err);
      return c.json(response(false, "Invalid input"));
    }
  });
};
