import { FastifyInstance } from "fastify";

const logOutUserSchema = {
  body: {
    type: "object",
    properties: {
      logout: { type: "boolean" },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        logout: { type: "boolean" },
        message: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        logout: { type: "boolean" },
        message: { type: "string" },
      },
    },
  },
};

export default async function logOutRoute(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/logout",
    schema: logOutUserSchema,
    handler: app.logOutPlugin,
    preValidation: app.decryptBodyRequest,
    preHandler: app.authorizeOnRequest,
  });
}
