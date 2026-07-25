import type { PropsWithChildren } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const renderQueryHook = <T,>(hook: () => T) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  function QueryWrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  const rendered = renderHook(hook, { wrapper: QueryWrapper });

  return {
    ...rendered,
    unmount: () => {
      rendered.unmount();
      queryClient.clear();
    },
  };
};

export { waitFor };
