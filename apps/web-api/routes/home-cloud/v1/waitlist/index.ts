import { Elysia } from "elysia";
import { signupRoute } from "./signup";

export const waitlistRoutes = () => {
  const routes = new Elysia({ prefix: "/waitlist" }).use(signupRoute());

  return routes;
};
