import { FastifyInstance } from "fastify";

const paramsSchema = {
  type: "object",
  properties: {
    userId: { type: "integer" },
  },
  required: ["userId"],
  additionalProperties: false,
};

const languageResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          language_id: { type: "number" },
          name: { type: "string" },
          proficiency: { type: "string" },
        },
        required: ["language_id", "name", "proficiency"],
      },
    },
    message: { type: "string" },
  },
  required: ["data"],
};

const failedResponse = {
  type: "object",
  properties: {
    message: { type: "string" },
  },
  additionalProperties: false,
};

const responseSchema = {
  200: languageResponseSchema,
  401: failedResponse,
  500: failedResponse,
};

const schema = {
  params: paramsSchema,
  response: responseSchema,
};

export default async function userLanguagesByIdRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/user/:userId/languages",
    handler: app.userLanguagesByIdPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}
