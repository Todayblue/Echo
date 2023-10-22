"use client";

import React from "react";
import {
  QueryClientProvider,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

function QueryProvider({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <HydrationBoundary>{children}</HydrationBoundary>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default QueryProvider;
