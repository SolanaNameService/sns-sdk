import type { PropsWithChildren } from "react";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { resolve, safeResolve } from "@bonfida/spl-name-service/domain";
import { Connection, PublicKey } from "@solana/web3.js";

import { useResolve } from "../src/hooks/useResolve";
import { useSafeResolve } from "../src/hooks/useSafeResolve";
import { renderQueryHook, waitFor } from "./test-utils";

jest.mock("@bonfida/spl-name-service/domain", () => ({
  resolve: jest.fn(),
  safeResolve: jest.fn(),
}));

const mockedResolve = jest.mocked(resolve);
const mockedSafeResolve = jest.mocked(safeResolve);
const connection = new Connection("http://localhost:8899");
const domain = "domain.sol";
const resolvedTarget = new PublicKey(
  "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8",
);
const safeTarget = new PublicKey(
  "Fw1ETanDZafof7xEULsnq9UY6o71Tpds89tNwPkWLb1v",
);

beforeEach(() => {
  jest.clearAllMocks();
});

test("delegates safe resolution to the JavaScript SDK", async () => {
  mockedSafeResolve.mockResolvedValue(safeTarget);
  const hook = renderQueryHook(() => useSafeResolve(connection, domain));

  await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));

  expect(hook.result.current.data).toBe(safeTarget);
  expect(mockedSafeResolve).toHaveBeenCalledTimes(1);
  expect(mockedSafeResolve).toHaveBeenCalledWith(connection, domain);
  hook.unmount();
});

test("supports selection and a caller-provided query key", async () => {
  mockedSafeResolve.mockResolvedValue(safeTarget);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const queryKey = ["custom-safe-resolve", domain] as const;

  function QueryWrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  const hook = renderHook(
    () =>
      useSafeResolve(connection, domain, {
        queryKey,
        select: (target) => target.toBase58(),
      }),
    { wrapper: QueryWrapper },
  );

  await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));

  expect(hook.result.current.data).toBe(safeTarget.toBase58());
  expect(queryClient.getQueryData(queryKey)).toBe(safeTarget);
  hook.unmount();
  queryClient.clear();
});

test("keeps ordinary and safe resolution cache entries separate", async () => {
  mockedResolve.mockResolvedValue(resolvedTarget);
  mockedSafeResolve.mockResolvedValue(safeTarget);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function QueryWrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  const hook = renderHook(
    () => ({
      resolved: useResolve(connection, domain),
      safe: useSafeResolve(connection, domain),
    }),
    { wrapper: QueryWrapper },
  );

  await waitFor(() => {
    expect(hook.result.current.resolved.isSuccess).toBe(true);
    expect(hook.result.current.safe.isSuccess).toBe(true);
  });

  expect(mockedResolve).toHaveBeenCalledTimes(1);
  expect(mockedSafeResolve).toHaveBeenCalledTimes(1);
  expect(hook.result.current.resolved.data).toBe(resolvedTarget);
  expect(hook.result.current.safe.data).toBe(safeTarget);
  expect(
    queryClient.getQueryData(["useResolve", connection.rpcEndpoint, domain]),
  ).toBe(resolvedTarget);
  expect(
    queryClient.getQueryData([
      "useSafeResolve",
      connection.rpcEndpoint,
      domain,
    ]),
  ).toBe(safeTarget);
  hook.unmount();
  queryClient.clear();
});

test("preserves SDK errors in the query result", async () => {
  const mismatchError = new Error("SDK safe-resolution mismatch");
  mockedSafeResolve.mockRejectedValue(mismatchError);
  const hook = renderQueryHook(() => useSafeResolve(connection, domain));

  await waitFor(() => expect(hook.result.current.isError).toBe(true));

  expect(hook.result.current.error).toBe(mismatchError);
  hook.unmount();
});

test("disables null input and guards manual refetch", async () => {
  const hook = renderQueryHook(() => useSafeResolve(connection, null));

  expect(hook.result.current.fetchStatus).toBe("idle");
  expect(mockedSafeResolve).not.toHaveBeenCalled();

  await act(async () => {
    const result = await hook.result.current.refetch();
    expect(result.error?.message).toBe("Domain is required");
  });

  expect(mockedSafeResolve).not.toHaveBeenCalled();
  hook.unmount();
});
