import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";
import { uneval } from "devalue";

// devalue is faster than superjson but unsafe for user input on the server.
const transformer = {
  input: superjson,
  output: {
    serialize: (object: any) => uneval(object),
    // This `eval` only ever happens on the **client**
    deserialize: (object: any) => eval(`(${object})`),
  },
};

const t = initTRPC.context<Context>().create({
  transformer,
});

export const router = t.router;
export const publicProcedure = t.procedure;
