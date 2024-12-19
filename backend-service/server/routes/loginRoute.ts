import { FastifyInstance } from "fastify";
import S from "fluent-json-schema";

const loggingUserSchema = {
  body: {
    type: "object",
    required: ["userPassword", "email"],
    properties: {
      email: { type: "string", format: "email" },
      password: {
        type: "string",
        minLength: 8,
        pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}",
        writeOnly: true,
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
    preValidation: app.decryptBodyRequest,
  });
}
