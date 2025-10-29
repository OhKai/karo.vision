import { Elysia } from "elysia";

export const signupRoute = () => {
  const route = new Elysia().post("/signup", "abv");

  return route;
};
