const express = require("express");
const { success, failed, error } = require("./response");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json(success("Backend server is running", { ok: true }));
});

app.get("/health", (_req, res) => {
  res.json(success("Service is healthy", { healthy: true }));
});

app.use((_req, res) => {
  res.status(404).json(failed("Not found", null));
});

app.use((err, _req, res, _next) => {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json(error(err.message || "Internal server error", null));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
