import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { INFINITE_SCROLL_PAGE_SIZE } from "@karo-vision/home-cloud-config";
import { sql, eq, or, and, asc, desc } from "drizzle-orm";
import { files, videos } from "../../db/schema";

export const videosRouter = router({
  byId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const res = ctx.db
      .select()
      .from(videos)
      .innerJoin(files, eq(videos.fileId, files.id))
      .where(eq(videos.fileId, input))
      .get();

    if (!res) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
    }

    return {
      ...res.videos,
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
      const res = ctx.db
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
        ...row.videos,
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
        description: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        input.topic === undefined &&
        input.title === undefined &&
        input.tags === undefined &&
        input.description === undefined
      ) {
        // Nothing to update (causes drizzle error).
        const res = ctx.db
          .select()
          .from(videos)
          .innerJoin(files, eq(videos.fileId, files.id))
          .where(eq(videos.fileId, input.fileId))
          .get();

        if (!res) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Video not found",
          });
        }

        return {
          ...res.videos,
          file: res.files,
        };
      }

      // Start a transaction to ensure both updates succeed or both fail
      return ctx.db.transaction((tx) => {
        // Update videos table
        const videoUpdate = tx
          .update(videos)
          .set({
            description: input.description,
          })
          .where(eq(videos.fileId, input.fileId))
          .run();

        // Update files table
        const fileUpdate = tx
          .update(files)
          .set({
            topic: input.topic,
            title: input.title,
            tags: input.tags,
          })
          .where(eq(files.id, input.fileId))
          .run();

        if (videoUpdate.changes === 0 || fileUpdate.changes === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Video not found",
          });
        }

        const res = ctx.db
          .select()
          .from(videos)
          .innerJoin(files, eq(videos.fileId, files.id))
          .where(eq(videos.fileId, input.fileId))
          .get();

        if (!res) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Video not found",
          });
        }

        return {
          ...res.videos,
          file: res.files,
        };
      });
    }),
});

export type VideosRouterLike = typeof videosRouter;
export type VideosUtilsLike = typeof videosRouter;
