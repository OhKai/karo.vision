import { apiRouter } from "./routers/api";
import { videosRouter } from "./routers/videos";
import { router } from "./trpc";

export const appRouter = router({
  videos: videosRouter,
  api: apiRouter,
});

export type AppRouter = typeof appRouter;
