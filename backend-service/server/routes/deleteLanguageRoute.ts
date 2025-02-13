import { FastifyInstance } from "fastify";

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
        required: ["language_id", "name"],
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

export default async function deleteLanguage(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/delete/language:language_id",
    handler: app.deleteLanguagePlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}
