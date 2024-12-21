import { initDB } from "./db/drizzle";
import { createServer } from "./server/index";

const server = createServer({
  prefix: "/api",
  port: parseInt(process.env.PORT!),
});
initDB();

void server.start();
