import { defineConfig } from "drizzle-kit";
import { DB_FILE_NAME } from "./config";

export default defineConfig({
  out: "./drizzle",
  dialect: "sqlite",
  schema: "./src/backend/db/schema.ts",
  dbCredentials: {
    url: DB_FILE_NAME,
  },
});
