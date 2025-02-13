import { FastifyInstance } from "fastify";
// const queryStringJsonSchema = {
//     type: "object",
//     properties: {
//         username: { type: "boolean" },
//         email: { type: "boolean" },
//         created_at: { type: "boolean" },
//         updated_at: { type: "boolean" },
//         profile_photo_url: { type: "boolean" },
//         description: { type: "boolean" },
//         friends: { type: "boolean" },
//         name: { type: "boolean" },
//         country: { type: "boolean" },
//         city: { type: "boolean" },
//     },
//     additionalProperties: false,
// };

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
  // querystring: queryStringJsonSchema,
  response: responseSchema,
};

export default async function languagesRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/languages",
    handler: app.languagesPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}
