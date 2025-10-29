import { Elysia } from "elysia";
import { z } from "zod";

export const waitlistRoutes = () => {
  const routes = new Elysia({ prefix: "/waitlist" }).post(
    "/signup",
    ({ body }) => {
      // Resend with body email.

      return {
        success: true,
        message: "Successfully signed up for the waitlist!",
      };
    },
    {
      body: z.object({
        email: z.email(),
      }),
    },
  );

  return routes;
};
