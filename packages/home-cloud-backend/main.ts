import { initDB } from "./db/drizzle";
import { initManager } from "./manager";
import { createServer } from "./server/index";
import { PORT } from "@/config";

(async () => {
  const db = initDB();
  const server = createServer(db, {
    prefix: "/api",
    port: parseInt(PORT),
  });
  await initManager(db);

  void server.start();
})();
