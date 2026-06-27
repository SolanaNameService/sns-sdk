import {
  getMultipleRecords,
  getRecord as getRecordV4,
  getRecordV2Key,
  Record,
} from "@bonfida/spl-name-service";
import type { Hono } from "hono";
import { z } from "zod";

import { toSnsDomain } from "../utils/domain";
import { deprecatedEndpoint, getConnection, response, type Env } from "../utils/http";
import { domainRecordParamSchema, rpcQuerySchema } from "../utils/schemas";

export const registerRecordRoutes = (app: Hono<Env>) => {
  app.get("/record-key-v2/:domain/:record", (c) => {
    try {
      const { domain, record } = domainRecordParamSchema.parse(c.req.param());
      const res = getRecordV2Key(toSnsDomain(domain), record);
      return c.json(response(true, res.toBase58()));
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        return c.json(response(false, "Invalid input"), 400);
      }
      return c.json(response(false, "Internal error"), 500);
    }
  });

  app.get("/record-key/:domain/:record", (c) => {
    return c.json(deprecatedEndpoint("/record-key-v2/:domain/:record"), 400);
  });

  app.get("/record/:domain/:record", (c) => {
    return c.json(deprecatedEndpoint("/record-v2/:domain/:record"), 400);
  });

  app.get("/record-v2/:domain/:record", async (c) => {
    try {
      const { domain, record } = domainRecordParamSchema.parse(c.req.param());
      const { rpc } = rpcQuerySchema.parse(c.req.query());
      const connection = getConnection(c, rpc);
      const res = await getRecordV4(connection, toSnsDomain(domain), record, {
        deserialize: true,
      });

      return c.json(
        response(true, {
          deserialized: res.deserializedContent,
          stale: !res.verified.staleness,
          roa: res.verified.roa,
          record: {
            header: res.retrievedRecord.header,
            data: res.retrievedRecord.data.toString("base64"),
          },
        }),
      );
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        return c.json(response(false, "Invalid input"), 400);
      }
      return c.json(response(false, "Internal error"), 500);
    }
  });

  app.get("/records-v2/:domain", async (c) => {
    try {
      const { domain } = c.req.param();
      const rpc = c.req.query("rpc");
      const parsedRecords = c.req.query("records")?.split(",");
      const recordSchema = z.array(z.enum(Record));
      const records = recordSchema.parse(parsedRecords);

      if (!records || records.length === 0) {
        return c.json(response(false, "Missing records in URL query params"));
      }

      const recordsV2 = await getMultipleRecords(
        getConnection(c, rpc),
        toSnsDomain(domain),
        records,
        { deserialize: true },
      );
      const results = [];

      for (const res of recordsV2) {
        if (res === undefined) break;

        results.push({
          type: res.record,
          deserialized: res.deserializedContent,
          stale: !res.verified.staleness,
          roa: res.verified.roa,
          record: {
            header: res.retrievedRecord.header,
            data: res.retrievedRecord.data.toString("base64"),
          },
        });
      }

      return c.json(response(true, results));
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        return c.json(response(false, "Invalid input"), 400);
      }
      return c.json(response(false, "Internal error"), 500);
    }
  });

  app.get("/types/record", (c) => {
    return c.json(response(true, Record));
  });
};
