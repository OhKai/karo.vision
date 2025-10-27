import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { INFINITE_SCROLL_PAGE_SIZE } from "@karo-vision/home-cloud-config";
import { sql, eq, or, and, asc, desc } from "drizzle-orm";
import { files, music } from "../../db/schema";

export const musicRouter = router({
  byId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const res = ctx.db
      .select()
      .from(music)
      .innerJoin(files, eq(music.fileId, files.id))
      .where(eq(music.fileId, input))
      .get();

    if (!res) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Music not found" });
    }

    return {
      ...res.music,
      file: res.files,
    };
  }),

  list: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        direction: z.enum(["forward", "backward"]),
        seed: z.number().optional(),
        search: z.array(z.string().min(1)).optional(),
        sort: z
          .enum([
            "title-asc",
            "title-desc",
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
                const lowerTerm = term.toLowerCase();
                // For each search term, create OR conditions for each column we want to search
                return or(
                  // TODO: removed because mono and repo would also return title and name matches, which might be confusing.
                  //sql`lower(${music.channels}) LIKE ${"%" + lowerTerm + "%"}`,
                  sql`lower(${files.name}) LIKE ${"%" + lowerTerm + "%"}`,
                  sql`lower(${files.dirname}) LIKE ${"%" + lowerTerm + "%"}`,
                  sql`lower(${files.tags}) LIKE ${"%" + lowerTerm + "%"}`,
                  sql`lower(${files.title}) LIKE ${"%" + lowerTerm + "%"}`,
                  sql`lower(${files.topic}) LIKE ${"%" + lowerTerm + "%"}`,
                );
              }),
            );
          })
        : [];

      // Had to use query builder because relational query is giving weird typescript errors and
      // includes file: null for when where clause is false.
      const res = ctx.db
        .select()
        .from(music)
        .innerJoin(files, eq(music.fileId, files.id))
        .where(or(...searchConditions))
        .limit(INFINITE_SCROLL_PAGE_SIZE)
        .offset(input.cursor ?? 0)
        .orderBy(
          input.seed
            ? // LCG for random ordering.
              sql`(1103515245 * (${music.fileId} + ${input.seed}) + 12345) % 2147483648`
            : input.sort === "title-asc"
              ? sql`COALESCE(${files.title}, ${files.name})`
              : input.sort === "title-desc"
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
        )
        .all();

      return res.map((row) => ({
        ...row.music,
        file: row.files,
      }));
    }),

  update: publicProcedure
    .input(
      z.object({
        fileId: z.number(),
        topic: z.string().nullish(),
        title: z.string().nullish(),
        tags: z.array(z.string().min(1)).nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        input.topic === undefined &&
        input.title === undefined &&
        input.tags === undefined
      ) {
        // Nothing to update (causes drizzle error).
        const res = ctx.db
          .select()
          .from(music)
          .innerJoin(files, eq(music.fileId, files.id))
          .where(eq(music.fileId, input.fileId))
          .get();

        if (!res) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Music not found",
          });
        }

        return {
          ...res.music,
          file: res.files,
        };
      }

      // Update files table
      const fileUpdate = ctx.db
        .update(files)
        .set({
          topic: input.topic,
          title: input.title,
          tags: input.tags,
        })
        .where(eq(files.id, input.fileId))
        .run();

      if (fileUpdate.changes === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Music not found",
        });
      }

      const res = ctx.db
        .select()
        .from(music)
        .innerJoin(files, eq(music.fileId, files.id))
        .where(eq(music.fileId, input.fileId))
        .get();

      if (!res) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Music not found",
        });
      }

      return {
        ...res.music,
        file: res.files,
      };
    }),
});
