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
        "Express JSON API. All bodies use `{ success, message, data, error }` (see ApiResponse schema).",
    },
    servers: [{ url: "/", description: "This host" }],
    tags: [
      { name: "General", description: "Service info" },
      { name: "Health", description: "Liveness and database checks" },
    ],
    components: {
      schemas: {
        ApiErrorBody: {
          type: "object",
          required: ["code"],
          properties: {
            code: {
              type: "string",
              example: "VALIDATION_ERROR",
              description: "Stable machine-readable code",
            },
          },
          additionalProperties: true,
        },
        ApiResponse: {
          type: "object",
          required: ["success", "message", "data", "error"],
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: {
              nullable: true,
              oneOf: [
                { type: "object", additionalProperties: true },
                { type: "array" },
              ],
            },
            error: {
              nullable: true,
              oneOf: [{ type: "null" }, { $ref: "#/components/schemas/ApiErrorBody" }],
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
