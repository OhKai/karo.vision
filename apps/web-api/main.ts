/**
 * Karo Vision API Server
 * Entry point for the Bun + Elysia API server
 */

import { createApp } from "./app";
import { env } from "./env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 Karo Vision API is running`);
  console.log(`📍 Server: http://${env.HOST}:${env.PORT}/`);
  console.log(`🏥 Health Check: http://${env.HOST}:${env.PORT}/health`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});
