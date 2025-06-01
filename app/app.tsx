"use client";

import ResizeObserver from "./resize-observer";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/trpc-client";

const App = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ResizeObserver>{children}</ResizeObserver>
    </QueryClientProvider>
  );
};

export default App;
