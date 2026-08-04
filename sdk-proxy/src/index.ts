import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { registerDomainRoutes } from "./routes/domains";
import { registerInstructionRoutes } from "./routes/instructions";
import { registerRecordRoutes } from "./routes/records";
import { registerResolveRoutes } from "./routes/resolve";
import type { Env } from "./utils/http";

export { TokenizerCache } from "./tokenizer-cache";

const DEFAULT_CACHE_TTL_SECONDS = 10;

// Read-endpoint whitelist. Prefix match on the URL path (except "/types/record" which is exact).
const CACHEABLE_ROUTES = [
  "/domain-key/",
  "/domains/",
  "/primary-domain/",
  "/favorite-domain/",
  "/multiple-primary-domains/",
  "/multiple-favorite-domains/",
  "/reverse-key/",
  "/reverse-lookup/",
  "/subdomains/",
  "/record-key/",
  "/record-key-v2/",
  "/record/",
  "/record-v2/",
  "/records-v2/",
  "/types/record", // exact match, no trailing slash
];

const isCacheablePath = (pathname: string): boolean => {
  if (pathname === "/types/record") return true;
  return CACHEABLE_ROUTES.some((p) => pathname.startsWith(p));
};

const getCacheTtlSeconds = (raw: string | undefined): number => {
  if (!raw) return DEFAULT_CACHE_TTL_SECONDS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_CACHE_TTL_SECONDS;
};

const app = new Hono<Env>();

app.use("*", logger());
app.use("/*", cors({ origin: "*" }));
app.use("*", async (c, next) => {
  await next();

  const res = c.res;
  const method = c.req.method;
  const pathname = new URL(c.req.url).pathname;
  const hasClientRpc = Boolean(c.req.query("rpc"));

  const cacheable =
    method === "GET" && !hasClientRpc && isCacheablePath(pathname);

  res.headers.set(
    "Cache-Control",
    cacheable
      ? `public, max-age=${getCacheTtlSeconds(
          c.env.CACHE_TTL_SECONDS,
        )}, stale-while-revalidate=180, stale-if-error=0`
      : "no-store",
  );
});
app.get("/", async (c) =>
  c.text("Visit https://github.com/SolanaNameService/sns-sdk"),
);

registerResolveRoutes(app);
registerDomainRoutes(app);
registerRecordRoutes(app);
registerInstructionRoutes(app);

export default app;
