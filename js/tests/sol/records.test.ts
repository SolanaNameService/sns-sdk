require("dotenv").config();
import { describe, expect, jest, test } from "@jest/globals";
import { getIpfsRecord } from "../../src/record/helpers/getIpfsRecord";
import { getArweaveRecord } from "../../src/record/helpers/getArweaveRecord";
import { getEthRecord } from "../../src/record/helpers/getEthRecord";
import { getBtcRecord } from "../../src/record/helpers/getBtcRecord";
import { getLtcRecord } from "../../src/record/helpers/getLtcRecord";
import { getDogeRecord } from "../../src/record/helpers/getDogeRecord";
import { getEmailRecord } from "../../src/record/helpers/getEmailRecord";
import { getUrlRecord } from "../../src/record/helpers/getUrlRecord";
import { getDiscordRecord } from "../../src/record/helpers/getDiscordRecord";
import { getGithubRecord } from "../../src/record/helpers/getGithubRecord";
import { getRedditRecord } from "../../src/record/helpers/getRedditRecord";
import { getTwitterRecord } from "../../src/record/helpers/getTwitterRecord";
import { getTelegramRecord } from "../../src/record/helpers/getTelegramRecord";
import { getBscRecord } from "../../src/record/helpers/getBscRecord";
import { getRecords } from "../../src/record/getRecords";
import { Connection } from "@solana/web3.js";
import { Record } from "../../src/types/record";
import { getRecordKeySync } from "../../src/record/getRecordKeySync";

jest.setTimeout(20_000);

const connection = new Connection(process.env.RPC_URL!);

test("Records", async () => {
  const domain = "🍍.sol";
  getIpfsRecord(connection, domain).then((e) => {
    expect(e).toBe("QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR");
  });
  getArweaveRecord(connection, domain).then((e) =>
    expect(e).toBe("some-arweave-hash"),
  );
  getEthRecord(connection, domain).then((e) =>
    expect(e).toBe("0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6"),
  );
  getBtcRecord(connection, domain).then((e) =>
    expect(e).toBe("3JfBcjv7TbYN9yQsyfcNeHGLcRjgoHhV3z"),
  );
  getLtcRecord(connection, domain).then((e) =>
    expect(e).toBe("MK6deR3Mi6dUsim9M3GPDG2xfSeSAgSrpQ"),
  );
  getDogeRecord(connection, domain).then((e) =>
    expect(e).toBe("DC79kjg58VfDZeMj9cWNqGuDfYfGJg9DjZ"),
  );
  getEmailRecord(connection, domain).then((e) =>
    expect(e).toBe("🍍@gmail.com"),
  );
  getUrlRecord(connection, domain).then((e) => expect(e).toBe("🍍.io"));
  getDiscordRecord(connection, domain).then((e) => expect(e).toBe("@🍍#7493"));
  getGithubRecord(connection, domain).then((e) =>
    expect(expect(e).toBe("@🍍_dev")),
  );
  getRedditRecord(connection, domain).then((e) => expect(e).toBe("@reddit-🍍"));
  getTwitterRecord(connection, domain).then((e) => expect(e).toBe("@🍍"));
  return getTelegramRecord(connection, domain).then((e) =>
    expect(e).toBe("@🍍-tg"),
  );
});

const sub = "test.🇺🇸.sol";

test("Sub records", async () => {
  getEmailRecord(connection, sub).then((e) => expect(e).toBe("test@test.com"));
});

test("Get multiple records", async () => {
  const records = await getRecords(
    connection,
    "🍍.sol",
    [Record.Telegram, Record.Github, Record.Backpack],
    true,
  );
  expect(records[0]).toBe("@🍍-tg");
  expect(records[1]).toBe("@🍍_dev");
  expect(records[2]).toBe(undefined);
});

test("BSC", async () => {
  const res = await getBscRecord(connection, "aanda.sol");
  expect(res).toBe("0x4170ad697176fe6d660763f6e4dfcf25018e8b63");
});

describe("getRecordKeySync", () => {
  test.each([
    {
      domain: "domain1.sol",
      record: Record.SOL,
      expected: "ATH9akc5pi1PWDB39YY7VCoYzCxmz8XVj23oegSoNSPL",
    },
    {
      domain: "sub.domain2.sol",
      record: Record.SOL,
      expected: "AEgJVf6zaQfkyYPnYu8Y9Vxa1Sy69EtRSP8iGubx5MnC",
    },
    {
      domain: "domain3.sol",
      record: Record.Url,
      expected: "EuxtWLCKsdpwM8ftKjnD2Q8vBdzZunh7DY1mHwXhLTqx",
    },
    {
      domain: "sub.domain4.sol",
      record: Record.Url,
      expected: "64nv6HSbifdUgdWst48V4YUB3Y3uQXVQRD4iDZPd9qGx",
    },
    {
      domain: "domain5.sol",
      record: Record.IPFS,
      expected: "2uRMeYzKXaYgFVQ1Yh7fKyZWcxsFUMgpEwMi19sVjwjk",
    },
    {
      domain: "sub.domain6.sol",
      record: Record.IPFS,
      expected: "61JdnEhbd2bEfxnu2uQ38gM2SUry2yY8kBMEseYh8dDy",
    },
  ])("$domain", (e) => {
    expect(getRecordKeySync(e.domain, e.record).toBase58()).toBe(e.expected);
  });
});
