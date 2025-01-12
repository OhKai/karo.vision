"use client";

import { trpc } from "@/lib/trpc-client";
import { httpBatchLink } from "@trpc/client";
import ResizeObserver from "./resize-observer";
import { transformer } from "@/lib/transformer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PORT } from "@/config";

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      // In production we can use relative URLs since the client is served from the same origin as
      // the API.
      url:
        process.env.NODE_ENV === "development"
          ? `http://localhost:${PORT}/api`
          : `/api`,
      transformer,
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          //authorization: getAuthCookie(),
        };
      },
    }),
  ],
});

const queryClient = new QueryClient();

const App = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ResizeObserver>{children}</ResizeObserver>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
