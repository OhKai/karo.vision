import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const videosRouter = router({
  list: publicProcedure.query(({ ctx, input }) =>
    ctx.db.query.videos.findMany({ with: { file: true }, limit: 50 }),
  ),
});
