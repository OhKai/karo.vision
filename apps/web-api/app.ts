import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { routes } from "@/routes";
import { env } from "./env";

export const createApp = () => {
  // TODO: Figure out CORS for production since electron will be hosted on localhost but we can just
  // make all calls from the nodejs backend.
  const app = new Elysia()
    .use(
      cors(
        env.NODE_ENV === "development"
          ? {}
          : {
              origin: /(.*\.)?karo\.vision$/,
            },
      ),
    )
    .use(routes());

  return app;
};
