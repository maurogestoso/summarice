import { z } from "zod";

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Clerk
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_SIGNING_SECRET: z.string(),
  CLERK_SIGN_IN_URL: z.string(),
  CLERK_SIGN_UP_URL: z.string(),
  CLERK_SIGN_IN_FORCE_REDIRECT_URL: z.string(),
  CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string(),
  CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string(),
  CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string(),

  // Turso
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),

  // OpenAI
  OPENAI_API_KEY: z.string(),

  // Ngrok (only for development)
  NGROK_ENDPOINT_HOST: z.string().optional(),
});

const env = envSchema.parse({
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || "development"
});

export default env; 