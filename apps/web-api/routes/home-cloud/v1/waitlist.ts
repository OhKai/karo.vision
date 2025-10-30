import { Elysia } from "elysia";
import { z } from "zod";
import { addContactToAudience } from "@/services/mail";

export const waitlistRoutes = () => {
  const routes = new Elysia({ prefix: "/waitlist" }).post(
    "/signup",
    async ({ body }) => {
      console.log("Signing up for waitlist:", body.email);

      const data = await addContactToAudience(
        body.email,
        "b4f7838b-4696-4507-a03c-ee32de0d7d4e",
      );

      return {
        success: true,
        message: "Successfully signed up for the waitlist!",
        data,
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
