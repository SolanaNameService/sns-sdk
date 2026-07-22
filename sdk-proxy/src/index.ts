import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { registerDomainRoutes } from "./routes/domains";
import { registerInstructionRoutes } from "./routes/instructions";
import { registerRecordRoutes } from "./routes/records";
import { registerResolveRoutes } from "./routes/resolve";
import type { Env } from "./utils/http";

const app = new Hono<Env>();

app.use("*", logger());
app.use("/*", cors({ origin: "*" }));
app.get("/", async (c) =>
  c.text("Visit https://github.com/SolanaNameService/sns-sdk"),
);

registerResolveRoutes(app);
registerDomainRoutes(app);
registerRecordRoutes(app);
registerInstructionRoutes(app);

export default app;
