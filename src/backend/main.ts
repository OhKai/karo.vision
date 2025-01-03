import { initDB } from "./db/drizzle";
import { initManager } from "./manager";
import { createServer } from "./server/index";

(async () => {
  const server = createServer({
    prefix: "/api",
    port: parseInt(process.env.PORT!),
  });
  initDB();
  await initManager();

  void server.start();
})();
