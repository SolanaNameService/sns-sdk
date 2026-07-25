require("dotenv").config();

import { describe, expect, jest, test } from "@jest/globals";
import { Connection, PublicKey } from "@solana/web3.js";

import { getSnsDomainKeysForOwner } from "../src/utils/getSnsDomainKeysForOwner";
import { getSnsDomainsForOwner } from "../src/utils/getSnsDomainsForOwner";

jest.setTimeout(10_000);

const connection = new Connection(process.env.RPC_URL!);
const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");

const expectedDomains = [
  {
    domain: "wallet-guide-10",
    key: "9wcWEXmtUbmiAaWdhQ1nSaZ1cmDVdbYNbaeDcKoK5H8r",
  },
  {
    domain: "wallet-guide-3",
    key: "CZFQJkE2uBqdwHH53kBT6UStyfcbCWzh6WHwRRtaLgrm",
  },
  {
    domain: "wallet-guide-4",
    key: "ChkcdTKgyVsrLuD9zkUBoUkZ1GdZjTHEmgh5dhnR4haT",
  },
  {
    domain: "wallet-guide-6",
    key: "2NsGScxHd9bS6gA7tfY3xucCcg6H9qDqLdXLtAYFjCVR",
  },
  {
    domain: "wallet-guide-7",
    key: "6Yi9GyJKoFAv77pny4nxBqYYwFaAZ8dNPZX9HDXw5Ctw",
  },
  {
    domain: "wallet-guide-9",
    key: "8XXesVR1EEsCEePAEyXPL9A4dd9Bayhu9MRkFBpTkibS",
  },
];

describe("get domains for owner", () => {
  test("retrieves directly owned domain account keys", async () => {
    const keys = await getSnsDomainKeysForOwner(connection, owner);
    const actual = keys.map((key) => key.toBase58()).sort();
    const expected = expectedDomains.map(({ key }) => key).sort();

    expect(actual).toEqual(expected);
  });

  test("retrieves directly owned domains with names", async () => {
    const domains = await getSnsDomainsForOwner(connection, owner);
    const actual = domains
      .map(({ domain, key }) => ({
        domain,
        key: key.toBase58(),
      }))
      .sort((a, b) => a.domain.localeCompare(b.domain));

    expect(actual).toEqual(expectedDomains);
  });
});
