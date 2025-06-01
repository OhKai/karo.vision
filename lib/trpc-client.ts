import type { AppRouter } from "@/src/backend/server/router";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { transformer } from "@/lib/transformer";
import { PORT } from "@/config";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// Singletons method because this is a SPA and these only get created once on the client. It is
// possible these get shared for multiple "requests" during build SSR, but we don't load anything at
// that stage anyways as we just use it to create static entry files for the SPA.

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      // In production we can use relative URLs since the client is served from the same origin as
      // the API.
      url:
        process.env.NODE_ENV === "development"
          ? typeof window !== "undefined"
            ? `http://${location.hostname}:${PORT}/api`
            : `http://localhost:${PORT}/api`
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

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;
