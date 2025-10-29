import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  RESEND_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
