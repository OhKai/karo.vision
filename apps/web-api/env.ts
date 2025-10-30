import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  RESEND_API_KEY: z.string().min(1),
  /** Whether to use the Resend service for sending emails (defaults to true in production) */
  USE_RESEND: z
    .preprocess((val) => val === "true", z.boolean())
    .default(process.env.NODE_ENV === "production"),
});

export const env = envSchema.parse(process.env);
