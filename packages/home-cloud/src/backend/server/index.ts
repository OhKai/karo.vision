import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { AppRouter, appRouter } from "./router";
import { createContext } from "./context";
import { Db } from "../db/drizzle";
import cors from "@fastify/cors";
import { fsRouter } from "./routers/fs";

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
}

export const createServer = (db: Db, opts: ServerOptions) => {
  const dev = opts.dev ?? process.env.NODE_ENV !== "production";
  const port = opts.port ?? 2024;
  const prefix = opts.prefix ?? "/trpc";
  const server = fastify({ logger: dev });

  void server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: {
      router: appRouter,
      // Add db connection to context.
      createContext: (opt) => createContext({ ...opt, db }),
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  // TODO: What should CORS policy be in production? With multiple DB instances combining, we might
  // need to be very permissive. Only applies to APIs used in the browser though.
  void server.register(cors, {
    origin: true,
  });

  server.get("/", async () => {
    return { hello: "wait-on 💨" };
  });

  // Setup fs file routes.
  fsRouter(server, db);

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
};
