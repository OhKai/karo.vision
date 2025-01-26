import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/config";
import { isNotNull, like, sql, eq, or, and, asc, desc } from "drizzle-orm";
import { files, videos } from "../../db/schema";

export const videosRouter = router({
  list: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        direction: z.enum(["forward", "backward"]),
        seed: z.number().optional(),
        search: z.array(z.string().min(1)).optional(),
        sort: z
          .enum([
            "name-asc",
            "name-desc",
            "date-asc",
            "date-desc",
            "size-asc",
            "size-desc",
            "random",
          ])
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchConditions = input.search
        ? input.search.map((query) => {
            return and(
              ...query.split(" ").map((term) => {
                // For each search term, create OR conditions for each column we want to search
                return or(
                  sql`lower(${videos.description}) LIKE ${"%" + term.toLowerCase() + "%"}`,
                  sql`lower(${files.name}) LIKE ${"%" + term.toLowerCase() + "%"}`,
                  sql`lower(${files.dirname}) LIKE ${"%" + term.toLowerCase() + "%"}`,
                  sql`lower(${files.tags}) LIKE ${"%" + term.toLowerCase() + "%"}`,
                  sql`lower(${files.title}) LIKE ${"%" + term.toLowerCase() + "%"}`,
                  sql`lower(${files.topic}) LIKE ${"%" + term.toLowerCase() + "%"}`,
                );
              }),
            );
          })
        : [];

      // Had to use query builder because relational query is giving weird typescript errors and
      // includes file: null for when where clause is false.
      const res = await ctx.db
        .select()
        .from(videos)
        .innerJoin(files, eq(videos.fileId, files.id))
        .where(or(...searchConditions))
        .limit(INFINITE_SCROLL_PAGE_SIZE)
        .offset(input.cursor ?? 0)
        .orderBy(
          input.seed
            ? // LCG for random ordering.
              sql`(1103515245 * (${videos.fileId} + ${input.seed}) + 12345) % 2147483648`
            : input.sort === "name-asc"
              ? sql`COALESCE(${files.title}, ${files.name})`
              : input.sort === "name-desc"
                ? sql`COALESCE(${files.title}, ${files.name}) DESC`
                : input.sort === "date-asc"
                  ? asc(files.createdAt)
                  : input.sort === "date-desc"
                    ? desc(files.createdAt)
                    : input.sort === "size-asc"
                      ? asc(files.size)
                      : input.sort === "size-desc"
                        ? desc(files.size)
                        : // Default to date-desc
                          desc(files.createdAt),
        );

      return res.map((row) => ({
        ...row.videos,
        file: row.files,
      }));
    }),
});
