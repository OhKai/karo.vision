import { apiRouter } from "./routers/api";
import { photosRouter } from "./routers/photos";
import { videosRouter } from "./routers/videos";
import { musicRouter } from "./routers/music";
import { router } from "./trpc";

export const appRouter = router({
  videos: videosRouter,
  photos: photosRouter,
  music: musicRouter,
  api: apiRouter,
});

export type AppRouter = typeof appRouter;
