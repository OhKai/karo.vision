import { Elysia } from "elysia";
import { waitlistRoutes } from "./waitlist";

export const v1Routes = () => {
  const routes = new Elysia({ prefix: "/v1" }).use(waitlistRoutes());

  return routes;
};
