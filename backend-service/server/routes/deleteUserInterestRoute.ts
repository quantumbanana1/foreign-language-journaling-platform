import { FastifyInstance } from "fastify";

const queryStringJsonSchema = {
  type: "object",
  properties: {
    interest_id: { type: "number" },
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
export default async function deleteUserInterestRoute(app: FastifyInstance) {
  app.route({
    method: "DELETE",
    url: "/delete/user/interest",
    handler: app.deleteUserInterestPlugin,
    preHandler: app.authorizeOnRequest,
    schema: schema,
  });
}
