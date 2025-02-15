import { FastifyInstance } from "fastify";

const queryStringJsonSchema = {
  type: "object",
  properties: {
    language_id: { type: "number" },
  },
  additionalProperties: false,
};

const responseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
          success: { type: "boolean" }, // Fixed: Added `type` key
        },
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  },
  401: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
    additionalProperties: false, // Added `additionalProperties` for consistency
  },
};

const schema = {
  querystring: queryStringJsonSchema,
  response: responseSchema,
};
export default async function deleteLanguage(app: FastifyInstance) {
  app.route({
    method: "DELETE",
    url: "/delete/language",
    handler: app.deleteLanguagePlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}
