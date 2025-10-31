/**
 * Karo Vision API Server
 * Entry point for the Bun + Elysia API server
 */

import { createApp } from "./app";
import { env } from "./env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 Karo Vision API is running`);
  console.log(`📡 Listening on port: ${env.PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  if (env.NODE_ENV === "production") {
    console.log(`📍 Server: https://${env.HOST}/`);
    console.log(`🏥 Health Check: https://${env.HOST}/health`);
  }
});
