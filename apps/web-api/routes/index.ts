import { Elysia } from "elysia";
import { homeCloudRoutes } from "./home-cloud";

export const routes = () => {
  const routes = new Elysia().use(homeCloudRoutes());

  return routes;
};
