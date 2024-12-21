import { relations, sql } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const files = sqliteTable("files", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  path: text().notNull(),
  rootFolderId: int("root_folder_id")
    .notNull()
    .references(() => rootFolders.id, { onDelete: "cascade" }),
  size: int().notNull(),
  topic: text(),
  title: text(),
  tags: text({ mode: "json" }).$type<string[]>(),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
  /**
   * The timestamp when the file on disk was last changed. Does _not_ include changes inside the
   * home-cloud meta data.
   */
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull(),
  indexedAt: int("indexed_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  lastOpenedAt: int("last_opened_at", { mode: "timestamp" }),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  rootFolder: one(rootFolders, {
    fields: [files.rootFolderId],
    references: [rootFolders.id],
  }),
  videos: many(videos),
}));

export const rootFolders = sqliteTable("root_folders", {
  id: int().primaryKey({ autoIncrement: true }),
  path: text().notNull(),
  isRemovable: int("is_removable", { mode: "boolean" }),
});

export const rootFoldersRelations = relations(rootFolders, ({ many }) => ({
  files: many(files),
}));

export const videos = sqliteTable("videos", {
  fileId: int("file_id")
    .primaryKey()
    .references(() => files.id, { onDelete: "cascade" }),
  width: int().notNull(),
  height: int().notNull(),
  duration: real().notNull(),
  format: text().notNull(),
  framerate: text().notNull(),
  aspectRatio: text("aspect_ratio").notNull(),
  description: text(),
  resumeTime: int("resume_time"),
});

export const videosRelations = relations(videos, ({ one }) => ({
  file: one(files, {
    fields: [videos.fileId],
    references: [files.id],
  }),
}));
