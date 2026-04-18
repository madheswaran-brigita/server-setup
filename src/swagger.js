const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Server setup API",
      version: "1.0.0",
      description:
        "Express JSON API. Responses use a shared envelope: `id`, `status` (`success` | `error` | `failed`), `message`, `data`.",
    },
    servers: [{ url: "/", description: "This host" }],
    tags: [
      { name: "General", description: "Service info" },
      { name: "Health", description: "Liveness and database checks" },
    ],
    components: {
      schemas: {
        ApiEnvelope: {
          type: "object",
          required: ["id", "status", "message", "data"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique id for this response",
            },
            status: {
              type: "string",
              enum: ["success", "error", "failed"],
            },
            message: { type: "string" },
            data: {
              description: "Payload or null",
              nullable: true,
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, "server.js")],
};

function setupSwagger(app) {
  const spec = swaggerJsdoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(spec, { customSiteTitle: "API docs" })
  );
}

module.exports = { setupSwagger };
