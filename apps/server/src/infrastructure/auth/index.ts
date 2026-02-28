import { betterAuth } from "better-auth";
import { Database } from "bun:sqlite";
import path from "path";

const authDb = new Database(path.join(import.meta.dir, "../../../../data.db"));

export const auth = betterAuth({
  database: authDb,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:3001",
  ],
});
