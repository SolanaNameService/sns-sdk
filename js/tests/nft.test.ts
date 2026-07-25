require("dotenv").config();
import { test, jest, expect } from "@jest/globals";
import { PublicKey, Connection } from "@solana/web3.js";
import { getSnsNftsForOwner } from "../src/utils/getSnsNftsForOwner";

jest.setTimeout(10_000);

const connection = new Connection(process.env.RPC_URL!);

const items = [
  {
    owner: new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
    domains: [
      {
        domain: "wallet-guide-5",
        key: "iSNVgWfb31aTWa58UxZ6fp7n3TTrUk5Gojggub5stXk",
        mint: "2RJhBbxTiPT2bZq5bhjaTZbsnhbDB7VtTAMmCdBrwBZP",
      },
      {
        domain: "wallet-guide-0",
        key: "uDTBDfKrJSBTgmWUZLcENPk5YrHfWbcrUbNFLjsvNpn",
        mint: "Eskv5Ns4gyREvNPPgANojNPsz6x1cbn9YwT7esAnxPhP",
      },
    ],
  },
];

test("Get tokenized domains", async () => {
  const domains = (
    await getSnsNftsForOwner(
      connection,
      new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
    )
  ).map((e) => {
    return {
      domain: e.domain,
      key: e.key.toBase58(),
      mint: e.mint.toBase58(),
    };
  });
  domains.sort((a, b) => b.domain!.localeCompare(a.domain!));
  for (let item of items) {
    expect(domains).toEqual(item.domains);
  }
});
