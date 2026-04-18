// CLI: npm run dev (watch) | npm start | PORT=4000 npm start
// Env: .env with EXTERNAL_DATABASE_URL + PGPORT (see .env.example)

require("dotenv").config();
const express = require("express");
const { pool } = require("./db");
const { success, failed, error } = require("./response");

const app = express();
app.use(express.json());

app.get("/", (_req, res) =>
  res.json(success("Backend server is running", { ok: true }))
);

app.get("/health", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW() AS server_time");
    res.json(
      success("Service is healthy", {
        healthy: true,
        database: "connected",
        serverTime: rows[0]?.server_time,
      })
    );
  } catch (err) {
    res.status(503).json(
      failed("Database unreachable", {
        detail:
          process.env.NODE_ENV === "development" ? String(err.message) : undefined,
      })
    );
  }
});

app.use((_req, res) => res.status(404).json(failed("Not found", null)));

app.use((err, _req, res, _next) =>
  res
    .status(err.status && Number.isInteger(err.status) ? err.status : 500)
    .json(error(err.message || "Internal server error", null))
);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`http://localhost:${PORT}`)
);

async function shutdown() {
  await new Promise((r) => server.close(r));
  await pool.end().catch(() => {});
  process.exit(0);
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
