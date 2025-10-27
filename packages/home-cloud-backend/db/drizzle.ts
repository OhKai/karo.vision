import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import { DB_FILE_NAME } from "@/config";

/**
 * Establishes the database connection. If the database does not exist, it will be created and the
 * schema will be initialized. Any new migrations will be applied at runtime.
 */
export const initDB = () => {
  const db = drizzle({ connection: DB_FILE_NAME, schema: schema });

  // Apply all new migrations at runtime.
  migrate(db, { migrationsFolder: "./drizzle" });

  return db;
};

export type Db = ReturnType<typeof drizzle<typeof schema>>;
