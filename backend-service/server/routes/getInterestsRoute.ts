import { FastifyInstance } from "fastify";
const languageResponseSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          interest_id: { type: "number" },
          name: { type: "string" },
        },
        required: ["interest_id", "name"],
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
  response: responseSchema,
};

export default async function interestRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/interests",
    handler: app.getInterestsPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}
