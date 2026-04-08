import { FastifyInstance, FastifySchema } from "fastify";

export const checkIfUserCanEditSchema: FastifySchema = {
  params: {
    type: "object",
    required: ["postId", "commentId"],
    properties: {
      postId: { type: "integer" },
      commentId: { type: "integer" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "number" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            canEdit: { type: "boolean" },
          },
        },
      },
    },
    403: {
      type: "object",
      properties: {
        status: { type: "number" },
        error: { type: "null" },
        message: { type: "string" },
        data: {
          type: "object",
          nullable: true,
          properties: {
            canEdit: { type: "boolean" },
          },
        },
      },
    },
    500: {
      type: "object",
      properties: {
        status: { type: "number" },
        error: {},
        message: { type: "string" },
        data: { type: "null" },
      },
    },
  },
};

export default async function updateCommentRoute(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/get/:postId/comment/:commentId/can-edit",
    handler: app.checkIfUserCanEdit,
    onRequest: app.authorizeOnRequest,
    schema: checkIfUserCanEditSchema,
  });
}
