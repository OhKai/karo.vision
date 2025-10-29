import { Elysia } from "elysia";
import { routes } from "@/routes";

export const createApp = () => {
  const app = new Elysia().use(routes());

  return app;
};
