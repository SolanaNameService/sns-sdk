import { getSnsDomainKeySync } from "@bonfida/spl-name-service/domain";
import { Connection, PublicKey } from "@solana/web3.js";
import { act } from "react";

import { useResolve } from "../src/hooks/useResolve";
import { usePrimaryDomain } from "../src/hooks/usePrimaryDomain";
import { useReverseLookup } from "../src/hooks/useReverseLookup";
import { useSnsDomainsForOwner } from "../src/hooks/useSnsDomainsForOwner";
import { useSubdomains } from "../src/hooks/useSubdomains";
import { renderQueryHook, waitFor } from "./test-utils";

jest.setTimeout(60_000);

const connection = new Connection(process.env.RPC_URL!);

describe("v4 SDK hooks against mainnet fixtures", () => {
  test("resolves a full SNS domain", async () => {
    const hook = renderQueryHook(() =>
      useResolve(connection, "wallet-guide-5.sns", {
        select: (owner) => owner.toBase58(),
      }),
    );

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data).toBe(
      "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
    );
    hook.unmount();
  });

  test("returns sorted native SNS domains for an owner", async () => {
    const owner = new PublicKey("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8");
    const hook = renderQueryHook(() =>
      useSnsDomainsForOwner(connection, owner),
    );

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(
      hook.result.current.data?.map(({ domain, key }) => ({
        domain,
        key: key.toBase58(),
      })),
    ).toEqual([
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
    ]);
    hook.unmount();
  });

  test("returns a native primary-domain result", async () => {
    const owner = new PublicKey("Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v");
    const hook = renderQueryHook(() => usePrimaryDomain(connection, owner));

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data?.domain.toBase58()).toBe(
      "AgJujvNQgYESUwBPitq2VUrfTaT2bvueHbgvsxqZ2sHg",
    );
    expect(hook.result.current.data?.reverse).toBe("couponvault");
    expect(hook.result.current.data?.stale).toBe(false);
    hook.unmount();
  });

  test("returns null when no primary domain is set", async () => {
    const hook = renderQueryHook(() =>
      usePrimaryDomain(connection, PublicKey.default),
    );

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data).toBeNull();
    hook.unmount();
  });

  test("performs a reverse lookup", async () => {
    const domainKey = getSnsDomainKeySync("bonfida").pubkey;
    const hook = renderQueryHook(() => useReverseLookup(connection, domainKey));

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data).toBe("bonfida");
    hook.unmount();
  });

  test("finds subdomains from a TLD-trimmed SNS parent", async () => {
    const hook = renderQueryHook(() => useSubdomains(connection, "67679"));

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect([...(hook.result.current.data ?? [])].sort()).toEqual([
      "bullish",
      "hollaaa",
      "testing",
    ]);
    hook.unmount();
  });

  test("does not query when a nullable input is absent", () => {
    const hook = renderQueryHook(() => useResolve(connection, null));
    expect(hook.result.current.fetchStatus).toBe("idle");
    hook.unmount();
  });

  test("guards manual refetch when a required input is absent", async () => {
    const hook = renderQueryHook(() => useResolve(connection, null));
    let result!: Awaited<ReturnType<typeof hook.result.current.refetch>>;

    await act(async () => {
      result = await hook.result.current.refetch();
    });

    expect(result.error?.message).toBe("Domain is required");
    hook.unmount();
  });
});
