import { describe, expect, test } from "@jest/globals";
import { getRecordV2Key } from "../../src/record_v2/getRecordV2Key";
import { Record } from "../../src/types/record";

describe("getRecordV2Key", () => {
  test.each([
    {
      domain: "domain1.sol",
      record: Record.SOL,
      expected: "GBrd6Q53eu1T2PiaQAtm92r3DwxmoGvZ2D6xjtVtN1Qt",
    },
    {
      domain: "sub.domain2.sol",
      record: Record.SOL,
      expected: "A3EFmyCmK5rp73TdgLH8aW49PJ8SJw915arhydRZ6Sws",
    },
    {
      domain: "domain3.sol",
      record: Record.Url,
      expected: "DMZmnjcAnUwSje4o2LGJhipCfNZ5b37GEbbkwbQBWEW1",
    },
    {
      domain: "sub.domain4.sol",
      record: Record.Url,
      expected: "6o8JQ7vss6r9sw9GWNVugZktwfEJ67iUz6H63hhmg4sj",
    },
    {
      domain: "domain5.sol",
      record: Record.IPFS,
      expected: "DQHeVmAj9Nz4uAn2dneEsgBZWcfhUqLdtbDcfWhGL47D",
    },
    {
      domain: "sub.domain6.sol",
      record: Record.IPFS,
      expected: "Dj7tnTTaktrrmdtatRuLG3YdtGZk8XEBMb4w5WtCBHvr",
    },
  ])("$domain", (e) => {
    expect(getRecordV2Key(e.domain, e.record).toBase58()).toBe(e.expected);
  });
});
