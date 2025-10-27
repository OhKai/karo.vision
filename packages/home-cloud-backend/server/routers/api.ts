import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { version } from "../../../../package.json";

export const apiRouter = router({
  version: publicProcedure.query(() => {
    return { version };
  }),
});
