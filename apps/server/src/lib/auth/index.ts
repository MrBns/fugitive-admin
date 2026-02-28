import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authDb = new Database(
  process.env.DATABASE_PATH ?? path.join(__dirname, "../../../../data.db")
);

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
