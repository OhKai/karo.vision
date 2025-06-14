import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/config";
import { isNotNull, like, sql, eq, or, and, asc, desc } from "drizzle-orm";
import { files, photos } from "../../db/schema";

export const photosRouter = router({
  byId: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const res = ctx.db
      .select()
      .from(photos)
      .innerJoin(files, eq(photos.fileId, files.id))
      .where(eq(photos.fileId, input))
      .get();

    if (!res) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Photo not found" });
    }

    return {
      ...res.photos,
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
                  sql`lower(${photos.description}) LIKE ${"%" + term.toLowerCase() + "%"}`,
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
        .from(photos)
        .innerJoin(files, eq(photos.fileId, files.id))
        .where(or(...searchConditions))
        .limit(INFINITE_SCROLL_PAGE_SIZE)
        .offset(input.cursor ?? 0)
        .orderBy(
          input.seed
            ? // LCG for random ordering.
              sql`(1103515245 * (${photos.fileId} + ${input.seed}) + 12345) % 2147483648`
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
        ...row.photos,
        file: row.files,
      }));
    }),

  update: publicProcedure
    .input(
      z.object({
        photoId: z.number(),
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
          .from(photos)
          .innerJoin(files, eq(photos.fileId, files.id))
          .where(eq(photos.fileId, input.photoId))
          .get();

        if (!res) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Photo not found",
          });
        }

        return {
          ...res.photos,
          file: res.files,
        };
      }

      // Start a transaction to ensure both updates succeed or both fail
      return ctx.db.transaction((tx) => {
        // Update photos table
        const photoUpdate = tx
          .update(photos)
          .set({
            description: input.description,
          })
          .where(eq(photos.fileId, input.photoId))
          .run();

        // Update files table
        const fileUpdate = tx
          .update(files)
          .set({
            topic: input.topic,
            title: input.title,
            tags: input.tags,
          })
          .where(eq(files.id, input.photoId))
          .run();

        if (photoUpdate.changes === 0 || fileUpdate.changes === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Photo not found",
          });
        }

        const res = ctx.db
          .select()
          .from(photos)
          .innerJoin(files, eq(photos.fileId, files.id))
          .where(eq(photos.fileId, input.photoId))
          .get();

        if (!res) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Photo not found",
          });
        }

        return {
          ...res.photos,
          file: res.files,
        };
      });
    }),
});
