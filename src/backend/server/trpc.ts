import { initTRPC } from "@trpc/server";
//import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  // TODO: what does SQLite return for Dates, is this needed?
  //transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
