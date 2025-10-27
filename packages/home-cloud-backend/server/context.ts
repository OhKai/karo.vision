import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { Db } from "../db/drizzle";

export const createContext = ({
  req,
  res,
  db,
}: CreateFastifyContextOptions & { db: Db }) => {
  return { req, res, db };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
