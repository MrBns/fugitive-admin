import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";
import * as schema from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH ??
  path.join(__dirname, "../../../../data.db");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
