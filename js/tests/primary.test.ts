require("dotenv").config();
import { test, expect, jest } from "@jest/globals";
import {
  getPrimaryDomain,
  getMultiplePrimaryDomains,
} from "../src/primary-domain";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";

jest.setTimeout(10_000);

const connection = new Connection(process.env.RPC_URL!);

test("Primary domain", async () => {
  const items = [
    {
      user: new PublicKey("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
      primary: {
        domain: new PublicKey("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
        reverse: "bonfida",
        stale: true,
      },
    },
    {
      user: new PublicKey("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v"),
      primary: {
        domain: new PublicKey("AgJujvNQgYESUwBPitq2VUrfTaT2bvueHbgvsxqZ2sHg"),
        reverse: "couponvault",
        stale: false,
      },
    },
  ];
  for (let item of items) {
    const primary = await getPrimaryDomain(connection, item.user);
    expect(primary.domain.toBase58()).toBe(item.primary.domain.toBase58());
    expect(primary.reverse).toBe(item.primary.reverse);
    expect(primary.stale).toBe(item.primary.stale);
  }
});

test("Multiple primary domains", async () => {
  const items = [
    // Non tokenized
    {
      wallet: new PublicKey("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v"),
      domain: "couponvault",
    },
    // Stale non tokenized
    {
      wallet: new PublicKey("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
      domain: undefined,
    },
    // Random pubkey
    { wallet: Keypair.generate().publicKey, domain: undefined },
    // Tokenized
    {
      wallet: new PublicKey("36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
      domain: "fav-tokenized",
    },
  ];
  const result = await getMultiplePrimaryDomains(
    connection,
    items.map((e) => e.wallet),
  );
  result.forEach((x, idx) => expect(x).toBe(items[idx].domain));
});
