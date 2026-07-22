import { Record } from "@bonfida/spl-name-service";
import { Connection } from "@solana/web3.js";

import { useProfilePic } from "../src/hooks/useProfilePic";
import { useRecords } from "../src/hooks/useRecords";
import { renderQueryHook, waitFor } from "./test-utils";

jest.setTimeout(60_000);

const connection = new Connection(process.env.RPC_URL!);
const domain = "wallet-guide-9.sns";

describe("verified record hooks against mainnet fixtures", () => {
  test("preserves order and filters stale records", async () => {
    const hook = renderQueryHook(() =>
      useRecords(
        connection,
        domain,
        [Record.IPFS, Record.Email, Record.Url],
        {
          deserialize: true,
        },
        {
          staleTime: 60_000,
        },
      ),
    );

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data?.[0]?.record).toBe(Record.IPFS);
    expect(hook.result.current.data?.[0]?.deserializedContent).toBe(
      "ipfs://test",
    );
    expect(hook.result.current.data?.[0]?.verified.staleness).toBe(true);
    expect(hook.result.current.data?.[1]).toBeUndefined();
    expect(hook.result.current.data?.[2]).toBeUndefined();
    hook.unmount();
  });

  test("returns verified, deserialized profile-picture content", async () => {
    const hook = renderQueryHook(() => useProfilePic(connection, domain));

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data).toBe(
      "https://pbs.twimg.com/profile_images/1733193526714699776/D-6E81Lc_400x400.png",
    );
    hook.unmount();
  });
});
