import * as z from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
  TEST_SERVICE_BASE_URL: z
    .string()
    .url("TEST_SERVICE_BASE_URL must be a valid URL"),
  USER_API_URL: z.string().url("USER_API_URL must be a valid URL"),
  RESULT_API_URL: z.string().url("RESULT_API_URL must be a valid URL"),
  PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  GATEWAY_SECRET: z
    .string()
    .min(32, "GATEWAY_SECRET must be at least 32 characters"),
  TRANSCRIPTION_MODEL: z.string().default("whisper-large-v3-turbo"),
  CHAT_MODEL: z.string().default("llama-3.1-8b-instant"),
  MAX_TRANSCRIPTION_LENGTH: z.coerce.number().default(25 * 1024 * 1024), // 25 MB
  MAX_CHAT_HISTORY: z.coerce.number().default(10),
  MAX_CHAT_MESSAGE_LENGTH: z.coerce.number().default(500),
});

const env = envSchema.parse(process.env);

const validateEnv = () => env;

export { env };
export default validateEnv;