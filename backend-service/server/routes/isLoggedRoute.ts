import { FastifyInstance } from "fastify";

const schema = {
  headers: {
    type: "object",
    properties: {
      cookie: {
        type: "string",
        description: "Session cookie for authentication",
      },
    },
    required: ["cookie"],
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

export default async function logOutRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/auth",
    handler: app.isLogged,
    schema: schema,
  });
}
