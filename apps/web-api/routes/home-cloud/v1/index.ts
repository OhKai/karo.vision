import { Elysia } from "elysia";

export const v1Routes = () => {
  const routes = new Elysia({ prefix: "/v1" });

  return routes;
};
