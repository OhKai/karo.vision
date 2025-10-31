import { Elysia } from "elysia";
import { homeCloudRoutes } from "./home-cloud";

export const routes = () => {
  const routes = new Elysia().use(homeCloudRoutes()).get("/health", () => ({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }));

  return routes;
};
