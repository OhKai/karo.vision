import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/config";

export const videosRouter = router({
  list: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        direction: z.enum(["forward", "backward"]),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.query.videos.findMany({
        with: { file: true },
        limit: INFINITE_SCROLL_PAGE_SIZE,
        offset: input.cursor ?? 0,
      }),
    ),
});
