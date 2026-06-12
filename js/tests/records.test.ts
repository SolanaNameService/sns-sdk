import { describe, expect, test } from "@jest/globals";
import { serializeRecord } from "../src/record/serializeRecord";
import { deserializeRecord } from "../src/record/deserializeRecord";
import { PublicKey } from "@solana/web3.js";
import { Record } from "../src/types/record";
import { NameRegistryState } from "../src/state";
import { getRecordKeySync } from "../src/record/getRecordKeySync";
import { UnsupportedTldError } from "../src/error";

test("Des/ser", () => {
  const items = [
    { content: "this is a test", record: Record.TXT },
    {
      content: "inj13glcnaum2xqv5a0n0hdsmv0f6nfacjsfvrh5j9",
      record: Record.Injective,
    },
    {
      content: "example.com",
      record: Record.CNAME,
    },
    {
      content: "example.com",
      record: Record.CNAME,
    },
    {
      content: "0xc0ffee254729296a45a3885639ac7e10f9d54979",
      record: Record.ETH,
    },
    {
      content: "1.1.1.4",
      record: Record.A,
    },
    {
      content: "2345:425:2ca1::567:5673:23b5",
      record: Record.AAAA,
    },
    {
      content: "username",
      record: Record.Discord,
    },
  ];

  items.forEach((e) => {
    const ser = serializeRecord(e.content, e.record);
    const registry: NameRegistryState = {
      data: ser,
      parentName: PublicKey.default,
      class: PublicKey.default,
      owner: PublicKey.default,
    };
    const des = deserializeRecord(registry, e.record, PublicKey.default);
    expect(des).toBe(e.content);
  });
});

describe("getRecordKeySync - input validation", () => {
  test("throws UnsupportedTldError on bare name", () => {
    expect(() => getRecordKeySync("bonfida", Record.SOL)).toThrow(
      UnsupportedTldError,
    );
  });
});
