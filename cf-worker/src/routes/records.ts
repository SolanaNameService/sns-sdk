import {
  getMultipleRecords,
  getRecord,
  getRecordV2Key,
  Record,
  type RecordResult,
} from "@bonfida/spl-name-service";
import type { Hono } from "hono";
import { z } from "zod";

import { toSnsDomain } from "../utils/domain";
import {
  deprecatedEndpoint,
  getConnection,
  response,
  type Env,
} from "../utils/http";
import {
  domainOrSubdomainWithoutTldSchema,
  domainRecordParamSchema,
  recordsQuerySchema,
} from "../utils/schemas";

const formatRecordResult = (res: RecordResult) => ({
  deserialized: res.deserializedContent,
  stale: !res.verified.staleness,
  roa: res.verified.roa,
  record: {
    header: res.retrievedRecord.header,
    data: res.retrievedRecord.data.toString("base64"),
  },
});

export const registerRecordRoutes = (app: Hono<Env>) => {
  app.get("/record-key-v2/:domain/:record", (c) => {
    try {
      const { domain, record } = domainRecordParamSchema.parse(c.req.param());
      const res = getRecordV2Key(domain, record);
      return c.json(response(true, res.toBase58()));
    } catch (err) {
      console.log(err);
      if (err instanceof z.ZodError) {
        return c.json(response(false, "Invalid input"), 400);
      }
      return c.json(response(false, "Internal error"), 500);
    }
  });

  app.get("/record-v2/:domain/:record", async (c) => {
    try {
      const { domain, record } = domainRecordParamSchema.parse(c.req.param());
      const connection = getConnection(c);
      const res = await getRecord(connection, toSnsDomain(domain), record, {
        deserialize: true,
      });

      return c.json(response(true, formatRecordResult(res)));
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
      const domain = domainOrSubdomainWithoutTldSchema.parse(
        c.req.param("domain"),
      );
      const { records } = recordsQuerySchema.parse(c.req.query());

      const recordsV2 = await getMultipleRecords(
        getConnection(c),
        toSnsDomain(domain),
        records,
        { deserialize: true },
      );
      const results = [];

      for (const res of recordsV2) {
        if (res === undefined) continue;

        results.push({
          type: res.record,
          ...formatRecordResult(res),
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

  app.get("/record-key/:domain/:record", (c) => {
    return c.json(deprecatedEndpoint("/record-key-v2/:domain/:record"), 400);
  });

  app.get("/record/:domain/:record", (c) => {
    return c.json(deprecatedEndpoint("/record-v2/:domain/:record"), 400);
  });
};
