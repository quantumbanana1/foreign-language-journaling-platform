import { FastifyInstance } from "fastify";

const loggingUserSchema = {
  body: {
    type: "object",
    required: ["userPassword", "email"],
    properties: {
      email: { type: "string", format: "email" },
      userPassword: {
        type: "string",
        minLength: 8,
        pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}",
        writeOnly: true,
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

export default async function loginRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/login",
    schema: loggingUserSchema,
    handler: app.loggingPlugin,
    // preValidation: app.decryptBodyRequest,
  });
}
