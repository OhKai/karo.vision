import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { AppRouter, appRouter } from "./router";
import { createContext } from "./context";

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? process.env.NODE_ENV !== "production";
  const port = opts.port ?? 2024;
  const prefix = opts.prefix ?? "/trpc";
  const server = fastify({ logger: dev });

  void server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  server.get("/", async () => {
    return { hello: "wait-on 💨" };
  });

  const stop = async () => {
    await server.close();
  };

  const start = async () => {
    try {
      await server.listen({ port });
      console.log("listening on port", port);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}
