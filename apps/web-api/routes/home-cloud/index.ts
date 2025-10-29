import { Elysia } from "elysia";
import { v1Routes } from "./v1";

export const homeCloudRoutes = () => {
  const routes = new Elysia({ prefix: "/home-cloud" }).use(v1Routes());

  return routes;
};
