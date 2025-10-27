import { initDB } from "@/db/drizzle";
import { initManager } from "@/manager";
import { createServer } from "@/server/index.ts";
import { PORT } from "@karo-vision/home-cloud-config";

(async () => {
  const db = initDB();
  const server = createServer(db, {
    prefix: "/api",
    port: parseInt(PORT),
  });
  await initManager(db);

  void server.start();
})();
