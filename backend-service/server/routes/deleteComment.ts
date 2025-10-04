import { FastifyInstance } from "fastify";

const queryStringJsonSchema = {
  type: "object",
  properties: {
    comment_id: { type: "number" },
    post_id: { type: "number" },
  },
  additionalProperties: false,
};

const responseSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
      success: { type: "boolean" },
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
export default async function deleteCommentRoute(app: FastifyInstance) {
  app.route({
    method: "DELETE",
    url: "/delete/post/:id/comment/:comment_id",
    handler: app.deleteCommentPlugin,
    onRequest: app.authorizeOnRequest,
    preHandler: app.canDelete,
    schema: schema,
  });
}
