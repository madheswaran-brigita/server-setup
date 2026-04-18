const { Pool } = require("pg");

/**
 * Postgres is configured with only:
 * - EXTERNAL_DATABASE_URL — full URL from Render (External Database URL)
 * - PGPORT — Postgres port (default 5432)
 *
 * Local: set in `.env` (loaded from `server.js` via dotenv). Production: Render env. Do not commit secrets.
 */
const externalDatabaseUrl = String(
  process.env.EXTERNAL_DATABASE_URL || process.env.DATABASE_URL || ""
).trim();
const pgPort = Number(process.env.PGPORT || 5432);

if (!externalDatabaseUrl) {
  throw new Error(
    "Set EXTERNAL_DATABASE_URL (or DATABASE_URL) to your Postgres external connection string."
  );
}

if (!Number.isFinite(pgPort) || pgPort <= 0) {
  throw new Error("PGPORT must be a positive number.");
}

const pool = new Pool({
  connectionString: externalDatabaseUrl,
  port: pgPort,
  ssl: { rejectUnauthorized: false },
});

module.exports = { pool };
