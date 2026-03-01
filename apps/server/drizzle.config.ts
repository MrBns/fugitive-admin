import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const DB_URL = process.env.DB_FILE || "../data.db";

export default defineConfig({
    out: "./.drizzle",
    schema: ["./src/lib/db/schema.ts", "./src/lib/db/auth-schema.ts"],
    dialect: "sqlite",
    dbCredentials: {
        url: DB_URL,
    },
});
