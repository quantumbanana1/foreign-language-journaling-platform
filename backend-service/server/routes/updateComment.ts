import { FastifyInstance } from "fastify";

const resposneSchema = {
  200: {
    type: "object",
    properties: {
      message: { type: "string" },
      success: { type: "boolean" },
      data: {
        type: "object",
        properties: {
          comment_id: { type: "integer" },
          post_id: { type: "integer" },
          content: { type: "string" },
        },
        required: ["comment_id", "post_id", "content"],
      },
    },
    additionalProperties: false,
  },
  500: {
    type: "object",
    properties: {
      uploadSuccess: { type: "boolean" },
      message: { type: "string" },
      additionalProperties: false,
    },
    additionalProperties: false,
  },
};

const body = {
  type: "object",
  properties: {
    content: {
      type: "string",
    },
    postId: { type: "number" },
    userId: { type: "number" },
    comment_id: { type: "number" },
  },
  additionalProperties: false,
};

const schema = {
  response: resposneSchema,
  body: body,
};

export default async function updateCommentRoute(app: FastifyInstance) {
  app.route({
    method: "PATCH",
    url: "/update/post/:id/comment/:comment_id",
    handler: app.updatePostCommentPlugin,
    onRequest: app.authorizeOnRequest,
    preHandler: app.authorizeIfEdit,
    schema: schema,
  });
}
